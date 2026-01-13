# Require provider
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

/*
* ------------------------------------------
* VARIABLES
* ------------------------------------------
*/

variable "settings" {
  description = "Settings"
  type = object({
    # General
    system_name = string
    system_env  = string # "production" or "staging"

    # Description of the Lambda function
    description = string
    # Handler function for the Lambda
    handler = string
    # Runtime for the Lambda function
    runtime = string
    # Memory size for the Lambda function
    memory_size = number
    # Timeout for the Lambda function
    timeout = number
    # Environment variables for the Lambda function
    environment_variables_map = map(string)
    # Source directory for the Lambda function
    source_dir = string
    # Event source for the Lambda function
    event_source = object({
      type          = string
      bucket        = string
      events        = list(string)
      filter_prefix = string
      filter_suffix = string
    })
    # Retry configuration for the Lambda function
    retry_config = object({
      max_retries   = number
      max_event_age = number
    })
    # IAM policy for the Lambda function
    iam_policy = string
  })
}

locals {
  function_name = "${var.settings.system_name}-${var.settings.system_env}-lambda"
}

/*
* ------------------------------------------
* IAM ROLE AND POLICY
* ------------------------------------------
*/

resource "aws_iam_role" "function_role" {
  name = "${local.function_name}-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "function_policy" {
  name   = "${local.function_name}-policy"
  role   = aws_iam_role.function_role.id
  policy = var.settings.iam_policy
}




/*
* ------------------------------------------
* LAMBDA FUNCTION
* ------------------------------------------
*/

# Lambda function
resource "aws_lambda_function" "function" {
  filename         = data.archive_file.function_source.output_path
  function_name    = local.function_name
  description      = var.settings.description
  role             = aws_iam_role.function_role.arn
  handler          = "function.handler"
  runtime          = var.settings.runtime
  memory_size      = var.settings.memory_size
  timeout          = var.settings.timeout
  source_code_hash = data.archive_file.function_source.output_base64sha256
  publish          = true

  environment {
    # variables = merge(
    #   {
    #     MEDIACONVERT_ROLE_ARN = aws_iam_role.mediaconvert_role.arn
    #   },
    #   var.settings.environment_variables_map
    # )
    variables = var.settings.environment_variables_map
  }
}

# Package function source code
data "archive_file" "function_source" {
  type        = "zip"
  output_path = "${path.module}/built-functions/${local.function_name}.zip"
  source_dir  = var.settings.source_dir
  excludes    = [".git", "README.md"]
}

# S3 event trigger (if configured)
resource "aws_s3_bucket_notification" "bucket_notification" {
  count  = var.settings.event_source != null ? 1 : 0
  bucket = var.settings.event_source.bucket

  dynamic "lambda_function" {
    for_each = var.settings.event_source.events
    content {
      lambda_function_arn = aws_lambda_function.function.arn
      events              = [lambda_function.value]
      filter_prefix       = var.settings.event_source.filter_prefix
      filter_suffix       = var.settings.event_source.filter_suffix
    }
  }
}

# Lambda permission for S3 (if configured)
resource "aws_lambda_permission" "allow_s3" {
  count         = var.settings.event_source != null ? 1 : 0
  statement_id  = "AllowS3Invoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.function.function_name
  principal     = "s3.amazonaws.com"
  source_arn    = "arn:aws:s3:::${var.settings.event_source.bucket}"
}

# Retry configuration (if configured)
resource "aws_lambda_function_event_invoke_config" "retry_config" {
  count                        = var.settings.retry_config != null ? 1 : 0
  function_name                = aws_lambda_function.function.function_name
  maximum_retry_attempts       = var.settings.retry_config.max_retries
  maximum_event_age_in_seconds = var.settings.retry_config.max_event_age
}

/*
* ------------------------------------------
* OUTPUTS
* ------------------------------------------
*/

output "function_name" {
  description = "The name of the Lambda function"
  value       = aws_lambda_function.function.function_name
}

output "function_arn" {
  description = "The ARN of the Lambda function"
  value       = aws_lambda_function.function.arn
}

output "role_arn" {
  description = "The ARN of the IAM role"
  value       = aws_iam_role.function_role.arn
}
