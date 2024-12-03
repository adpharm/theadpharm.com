locals {
  aws_profile = "pharmer"
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
    key     = "theadpharm.com/terraform.tfstate"
    region  = "ca-central-1"
    profile = "${local.aws_profile}"
    encrypt = true
  }
}

inputs = {
  aws_profile = local.aws_profile
}
