# Require provider
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
    vercel = {
      source  = "vercel/vercel"
      version = "~> 3.7"
    }
    bunnynet = {
      source  = "BunnyWay/bunnynet"
      version = "~> 0.7.5"
    }
    # pinecone = {
    #   source  = "pinecone-io/pinecone"
    #   version = "~> 1.0.0"
    # }
  }
}

locals {
  VERCEL_IP_ADDRESS = "76.76.21.21"
  VERCEL_CNAME_NAME = "cname.vercel-dns.com"
}

#########################################################################################################
##                                        Variables                                                     
########################################################################################################

# 
# Settings
# 
variable "settings" {
  description = "Settings"
  type = object({
    # 
    # General
    # 
    system_name = string
    # optionally, override the system env name (i.e. "production" or "staging")
    # default is the git branch name
    system_env_name = optional(string)

    # 
    # Specific settings
    # 
    bunny_cdn_domains = list(object({
      record_name = string
      root_domain = string
    }))

    # 
    # App settings
    # 
    vercel_project_id    = string
    git_branch_name      = string
    git_branch_hook_url  = optional(string)
    event_bridge_bus_arn = string
    app_domains = list(object({
      record_name          = string
      root_domain          = string
      redirect_to          = optional(string)
      redirect_status_code = optional(number)
    }))
    # pinecone_api_key = string
  })

  validation {
    # verify that the cdn record names ends with a dot, or that it's empty
    condition = alltrue(flatten([
      for domain in var.settings.bunny_cdn_domains :
      can(regex("\\.$", domain.record_name))
      # || domain.record_name == ""
    ]))
    # error_message = "The record_name must end with a dot, or be empty"
    error_message = "The record_name must end with a dot"
  }

  validation {
    # verify that the app record names ends with a dot, or that it's empty
    condition = alltrue(flatten([
      for domain in var.settings.app_domains :
      can(regex("\\.$", domain.record_name)) || domain.record_name == ""
    ]))
    error_message = "The record_name must end with a dot, or be empty"
  }
}

# 
# Env vars to add
# 
variable "extra_env_vars_to_add" {
  description = "Environment variables to add to the App"
  type = map(object({
    comment   = optional(string)
    value     = string
    sensitive = optional(bool)
  }))
  default = {}
}

locals {
  # 
  # generate unique id for this deployment based on the system name and system env
  #   i.e. "media-converter-production"
  # 
  system_name     = var.settings.system_name
  system_env_name = var.settings.system_env_name == null ? var.settings.git_branch_name : var.settings.system_env_name

  system_id         = replace("${local.system_name}-${local.system_env_name}", "/", "-")
  bucket_name       = "${local.system_id}-bucket"
  bunny_user_name   = "${local.system_id}-bunny-user"
  bunny_policy_name = "${local.system_id}-bunny-policy"
  pullzone_name     = local.system_id

  # the first domain in the cdn domains list is the main one
  main_cdn_domain = "${var.settings.bunny_cdn_domains[0].record_name}${var.settings.bunny_cdn_domains[0].root_domain}"

  # the first domain in the app domains list is the main one
  main_app_domain = "${var.settings.app_domains[0].record_name}${var.settings.app_domains[0].root_domain}"

  # folder in bucket for raw uploads
  # raw_uploads_folder = "uploads/raw"

  # folder in bucket for processed uploads
  # processed_uploads_folder = "uploads/processed"
}

#########################################################################################################
#
#  S3 Bucket
# 
########################################################################################################

# 
# 
# S3
# 
# 
resource "aws_s3_bucket" "bucket" {
  bucket = local.bucket_name
  tags = {
    Name = local.bucket_name
  }

  lifecycle {
    prevent_destroy = true
  }
}

# Enable versioning on the prod bucket
resource "aws_s3_bucket_versioning" "bucket_versioning" {
  bucket = aws_s3_bucket.bucket.bucket
  versioning_configuration {
    status = "Enabled"
  }
}

# Create cors policy for the prod bucket
resource "aws_s3_bucket_cors_configuration" "bucket_cors" {
  bucket = aws_s3_bucket.bucket.bucket
  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET"]
    # this is actually required because we're a public endpoint
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}


#########################################################################################################
# 
# BunnyNet
# 
#########################################################################################################

# Create an IAM user that can access the buckets
resource "aws_iam_user" "bunny_iamuser" {
  name = local.bunny_user_name
}

# Create an IAM policy that allows the IAM user to access the buckets
resource "aws_iam_policy" "bunny_iampolicy" {
  name        = local.bunny_policy_name
  description = "Policy to allow the ${local.bunny_user_name} user to access the ${local.bucket_name} bucket"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "s3:GetObject",
          "s3:ListBucket",
          # "s3:PutObject",
        ]
        Effect = "Allow"
        Resource = [
          "arn:aws:s3:::${local.bucket_name}",
          "arn:aws:s3:::${local.bucket_name}/*",
        ]
      },
    ]
  })
}

# Attach the policy to the IAM user
resource "aws_iam_user_policy_attachment" "bunny_iampolicyattachment" {
  user       = aws_iam_user.bunny_iamuser.name
  policy_arn = aws_iam_policy.bunny_iampolicy.arn
}

# Create an access key for the IAM user
resource "aws_iam_access_key" "bunny_accesskey" {
  user = aws_iam_user.bunny_iamuser.name
}

# Create the pull zone for the prod bucket
resource "bunnynet_pullzone" "pullzone" {
  name = local.pullzone_name

  origin {
    type = "OriginUrl"
    url  = "https://${local.bucket_name}.s3.ca-central-1.amazonaws.com"
  }

  routing {
    tier = "Standard"
    # AF, ASIA, EU, SA, US
    zones = ["US"]
  }

  # settings
  cache_enabled = true
  # Configure how long our edge servers will store your files before fetching for a new version. 
  # If Respect origin Cache-Control headers is enabled, bunny.net will follow any Cache-Control or Expire headers returned by your origin server.
  # cache seconds calulations:
  # 1 day = 86400
  # 1 week = 604800
  # 1 month = 2592000
  # 1 year = 31536000
  cache_expiration_time = 604800

  # s3 auth
  s3_auth_enabled = true
  s3_auth_key     = aws_iam_access_key.bunny_accesskey.id
  s3_auth_secret  = aws_iam_access_key.bunny_accesskey.secret
  s3_auth_region  = "ca-central-1"

  # Limit the maximum number of requests per second for single IP. Set to 0 for unlimited.
  limit_requests = 50

  # Limit the maximum number of allowed connections to the zone per IP. Set to 0 for unlimited.
  # For example, if you have a page with 10 images, then you'll need at least 10 connections to the zone per IP.
  limit_connections = 50

  # Limits the allowed bandwidth used in a month. If the limit is reached the zone will be disabled. Set to 0 for unlimited.
  # Measured in Bytes
  # Cost calculation: 0.01 per GB
  #   e.g. 5368709120 = 5GB = $0.05
  #   e.g. 53687091200 = 50GB = $0.50
  #   e.g. 5368709120000 = 5000GB = $50
  limit_bandwidth = 53687091200 # 50GB
}

# 
# 
# Bunny Hostname
# 
# 
# create the hostname for the pullzone (must be done after the DNS record is created)
resource "bunnynet_pullzone_hostname" "pullzone_hostname" {
  for_each = {
    for index, domain in var.settings.bunny_cdn_domains : domain.record_name => domain
  }
  depends_on  = [module.cdn_route53_records]
  pullzone    = bunnynet_pullzone.pullzone.id
  name        = "${each.value.record_name}${each.value.root_domain}"
  tls_enabled = true
  force_ssl   = true
}

#########################################################################################################
# 
# Lambda
# 
#########################################################################################################


/*
* ------------------------------------------
* Media Convert Role
* ------------------------------------------
*/

# Add MediaConvert IAM role
# resource "aws_iam_role" "mediaconvert_role" {
#   name = "${local.system_id}-mediaconvert-role"

#   assume_role_policy = jsonencode({
#     Version = "2012-10-17"
#     Statement = [
#       {
#         Action = "sts:AssumeRole"
#         Effect = "Allow"
#         Principal = {
#           Service = "mediaconvert.amazonaws.com"
#         }
#       }
#     ]
#   })
# }

# resource "aws_iam_role_policy" "mediaconvert_policy" {
#   name = "${local.system_id}-mediaconvert-policy"
#   role = aws_iam_role.mediaconvert_role.id

#   policy = jsonencode({
#     Version = "2012-10-17"
#     Statement = [
#       {
#         Effect = "Allow"
#         Action = [
#           "s3:GetObject",
#           "s3:PutObject",
#           "s3:ListBucket"
#         ]
#         Resource = [
#           "arn:aws:s3:::${local.bucket_name}",
#           "arn:aws:s3:::${local.bucket_name}/*",
#         ]
#       }
#     ]
#   })
# }


# module "lambda" {
#   source = "../../lib/lambda-function"

#   settings = {
#     system_name = local.system_name
#     system_env  = local.system_env_name

#     description = "Take a mov/mp4 file and take frames from it"
#     handler     = "function.handler"
#     runtime     = "nodejs20.x"
#     timeout     = 300
#     memory_size = 256

#     environment_variables_map = {
#       # 
#       # Specify the folder that outputs should be saved to
#       OUTPUT_FOLDER_S3_URI  = "s3://${local.bucket_name}/${local.processed_uploads_folder}/"
#       MEDIACONVERT_ROLE_ARN = aws_iam_role.mediaconvert_role.arn
#     }

#     source_dir = "../dist/create-media-convert-job"

#     event_source = {
#       type   = "s3"
#       bucket = aws_s3_bucket.bucket.id
#       events = ["s3:ObjectCreated:*"]
#       # 
#       # Specify the folder that will trigger the function
#       filter_prefix = local.raw_uploads_folder
#       filter_suffix = ""
#     }

#     retry_config = {
#       max_retries   = 2
#       max_event_age = 3600 # 1 hour
#     }

#     iam_policy = jsonencode({
#       Version = "2012-10-17"
#       Statement = [
#         {
#           Effect = "Allow"
#           Action = [
#             "s3:GetObject",
#             "s3:ListBucket"
#           ]
#           Resource = [
#             aws_s3_bucket.bucket.arn,
#             "${aws_s3_bucket.bucket.arn}/*"
#           ]
#         },
#         {
#           Effect = "Allow"
#           Action = [
#             "mediaconvert:CreateJob",
#             "mediaconvert:GetJob",
#             "mediaconvert:ListJobs"
#           ]
#           Resource = ["*"]
#         },
#         {
#           Effect = "Allow"
#           Action = [
#             "iam:PassRole"
#           ]
#           Resource = [
#             aws_iam_role.mediaconvert_role.arn
#           ]
#         },
#         {
#           Effect = "Allow"
#           Action = [
#             "logs:CreateLogGroup",
#             "logs:CreateLogStream",
#             "logs:PutLogEvents"
#           ]
#           Resource = ["arn:aws:logs:*:*:*"]
#         }
#       ]
#     })
#   }
# }

########################################################################################################
# 
# CDN domains
# 
########################################################################################################

module "cdn_route53_records" {
  for_each = {
    for index, domain in var.settings.bunny_cdn_domains : domain.record_name => domain
  }
  source  = "terraform-aws-modules/route53/aws//modules/records"
  version = "~> 5.0.0"

  zone_name = each.value.root_domain

  records_jsonencoded = jsonencode(each.value.record_name == "" ? [
    # if this is the root domain....
    # add the A record for the IP address
    # {
    #   name    = ""
    #   type    = "A"
    #   ttl     = 3600
    #   records = [local.VERCEL_IP_ADDRESS]
    # },
    ] : [
    # 
    # Otherwise, just add the CNAME record
    # 
    {
      name    = trimsuffix(each.value.record_name, ".")
      type    = "CNAME"
      ttl     = 3600
      records = ["${local.pullzone_name}.b-cdn.net"]
    },
  ])
}



# 
# 
# App
# 
# 

#########################################################################################################
#
#  App IAM User
# 
########################################################################################################

# create an IAM user for the App
resource "aws_iam_user" "app_iam_user" {
  name = "${local.system_id}-app-user"
}

# create an IAM policy for the App
resource "aws_iam_policy" "app_iampolicy" {
  name        = "${local.system_id}-app-policy"
  description = "Policy to allow the ${local.system_id}-app-user user to do stuff"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      # 
      # Allow the user to put objects in the bucket
      # 
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:ListBucket",
          "s3:DeleteObject",
        ]
        Resource = [
          "arn:aws:s3:::${local.bucket_name}",
          "arn:aws:s3:::${local.bucket_name}/*",
        ]
      },
      # 
      # Allow the user to put events in the event bus
      # 
      {
        Effect = "Allow"
        Action = [
          "events:PutEvents"
        ]
        Resource = [
          var.settings.event_bridge_bus_arn
        ]
      }
    ]
  })
}

# attach the policy to the IAM user
resource "aws_iam_user_policy_attachment" "app_iam_user_iampolicyattachment" {
  user       = aws_iam_user.app_iam_user.name
  policy_arn = aws_iam_policy.app_iampolicy.arn
}

# create an access key for the IAM user
resource "aws_iam_access_key" "app_iam_user_accesskey" {
  user = aws_iam_user.app_iam_user.name
}

#########################################################################################################
#
#  Pinecone Index
# 
########################################################################################################

# resource "pinecone_index" "index" {
#   name = "${local.system_id}-index"
#   # dimension should match the dimension of the embeddings
#   dimension = 1536
#   metric    = "cosine"
#   spec = {
#     serverless = {
#       cloud = "aws"
#       # us-east-1 required for starter plan
#       region = "us-east-1"
#     }
#   }
# }

########################################################################################################
# 
# Vercel
# 
########################################################################################################

module "vercel" {
  source = "../../lib/vercel"

  vercel_settings = {
    vercel_project_id   = var.settings.vercel_project_id
    git_branch_name     = var.settings.git_branch_name
    domains             = var.settings.app_domains
    git_branch_hook_url = var.settings.git_branch_hook_url
  }

  # env_vars_to_add = var.extra_env_vars_to_add

  env_vars_to_add = merge({
    AWS_ACCESS_KEY_ID = {
      comment = "AWS Access Key ID for the App to access S3"
      value   = aws_iam_access_key.app_iam_user_accesskey.id
    },
    AWS_SECRET_ACCESS_KEY = {
      comment   = "AWS Secret Access Key for the App to access S3"
      value     = aws_iam_access_key.app_iam_user_accesskey.secret
      sensitive = true
    },
    CDN_FQDN = {
      comment = "The fully qualified domain name of the assets CDN"
      value   = local.main_cdn_domain
    },
    APP_FQDN = {
      comment = "The fully qualified domain name of the app"
      value   = local.main_app_domain
    }
    S3_BUCKET_NAME = {
      comment = "The name of the bucket to use for the app"
      value   = local.bucket_name
    }
    # S3_PROCESSED_UPLOADS_FOLDER = {
    #   comment = "The folder in the bucket to use for processed uploads"
    #   value   = local.processed_uploads_folder
    # }
    # PINECONE_INDEX_NAME = {
    #   comment = "The name of the Pinecone index to use for the app"
    #   value   = pinecone_index.index.name
    # }
    # PINECONE_API_KEY = {
    #   comment   = "The API key to use for the Pinecone index"
    #   value     = var.settings.pinecone_api_key
    #   sensitive = true
    # }
  }, var.extra_env_vars_to_add)
}

########################################################################################################
# 
# App domains
# 
########################################################################################################

module "app_route53_records" {
  for_each = {
    for index, domain in var.settings.app_domains : domain.record_name => domain
  }
  source  = "terraform-aws-modules/route53/aws//modules/records"
  version = "~> 5.0.0"

  zone_name = each.value.root_domain

  records_jsonencoded = jsonencode(each.value.record_name == "" ? [
    # if this is the root domain....
    # add the A record for the IP address
    {
      name    = ""
      type    = "A"
      ttl     = 3600
      records = [local.VERCEL_IP_ADDRESS]
    },
    ] : [
    # 
    # Otherwise, just add the CNAME record
    # 
    {
      name    = trimsuffix(each.value.record_name, ".")
      type    = "CNAME"
      ttl     = 3600
      records = [local.VERCEL_CNAME_NAME]
    },
  ])
}

