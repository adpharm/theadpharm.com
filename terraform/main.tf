
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
data "aws_secretsmanager_secret" "app_secrets" {
  name = "adpharm/theadpharm.com"
}

data "aws_secretsmanager_secret_version" "app_secrets_version" {
  secret_id = data.aws_secretsmanager_secret.app_secrets.id
}

locals {
  vercel_api_token = jsondecode(data.aws_secretsmanager_secret_version.vercel_secret_version.secret_string)["vercel_token_tf_key_1"]
  app_secrets_json = jsondecode(data.aws_secretsmanager_secret_version.app_secrets_version.secret_string)

  app_secrets = [
    for key, value in local.app_secrets_json : {
      key       = key
      value     = value
      target    = ["production", "preview"]
      sensitive = true
    }
  ]
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


