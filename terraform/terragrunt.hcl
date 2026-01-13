locals {
  aws_profile = "pharmer"
  repo_name   = "APP_NAME" # doesn't have to match github
}

// generate the "backend" s3 bucket for storing tfstate
remote_state {
  backend = "s3"
  generate = {
    path      = "backend.tf"
    if_exists = "overwrite"
  }
  config = {
    bucket  = "terraform-state-sensitive"
    key     = "${local.repo_name}/terraform.tfstate"
    region  = "ca-central-1"
    profile = "${local.aws_profile}"
    encrypt = true
  }
}

inputs = {
  aws_profile = local.aws_profile
}

# Build functions before Terraform runs
// terraform {
//   before_hook "build_functions" {
//     commands = ["init", "plan", "apply"]
//     execute  = ["task", "build-functions"]
//   }
// }
