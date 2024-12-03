
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

locals {
  vercel_api_token = jsondecode(data.aws_secretsmanager_secret_version.vercel_secret_version.secret_string)["vercel_token_tf_key_1"]
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


