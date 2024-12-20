
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.78.0"
    }
    vercel = {
      source  = "vercel/vercel"
      version = "~> 2.5"
    }
  }
}

variable "aws_profile" {
  description = "AWS Profile to use"
  type        = string
}

provider "aws" {
  profile = var.aws_profile
  region  = "ca-central-1"
  default_tags {
    tags = {
      ManagedBy = "Terraform"
    }
  }
}

# get the vercel token from AWS Secrets Manager
data "aws_secretsmanager_secret" "vercel_secret" {
  name = "vercel/theadpharm"
}
data "aws_secretsmanager_secret_version" "vercel_secret_version" {
  secret_id = data.aws_secretsmanager_secret.vercel_secret.id
}

# get app secrets
data "aws_secretsmanager_secret" "app_secrets_preview" {
  name = "adpharm/theadpharm.com/preview"
}

data "aws_secretsmanager_secret" "app_secrets_prod" {
  name = "adpharm/theadpharm.com/prod"
}

data "aws_secretsmanager_secret_version" "app_secrets_version_preview" {
  secret_id = data.aws_secretsmanager_secret.app_secrets_preview.id
}

data "aws_secretsmanager_secret_version" "app_secrets_version_prod" {
  secret_id = data.aws_secretsmanager_secret.app_secrets_prod.id
}

locals {
  vercel_api_token         = jsondecode(data.aws_secretsmanager_secret_version.vercel_secret_version.secret_string)["vercel_token_tf_key_1"]
  app_secrets_preview_json = jsondecode(data.aws_secretsmanager_secret_version.app_secrets_version_preview.secret_string)
  app_secrets_prod_json    = jsondecode(data.aws_secretsmanager_secret_version.app_secrets_version_prod.secret_string)

  app_secrets_preview = [
    for key, value in local.app_secrets_preview_json : {
      key       = key
      value     = value
      target    = ["preview"]
      sensitive = true
    }
  ]

  app_secrets_prod = [
    for key, value in local.app_secrets_prod_json : {
      key       = key
      value     = value
      target    = ["production"]
      sensitive = true
    }
  ]

  app_secrets = concat(local.app_secrets_preview, local.app_secrets_prod)
}

provider "vercel" {
  api_token = local.vercel_api_token

  team = "adpharm"
}

resource "vercel_project" "proj" {
  name = "theadpharm-com"
  # framework = "astro"

  git_repository = {
    type = "github"
    repo = "adpharm/theadpharm.com"
  }
}

resource "vercel_project_environment_variables" "env_vars" {
  project_id = vercel_project.proj.id

  variables = local.app_secrets
}


