#########################################################################################################
## Vars
#########################################################################################################

variable "aws_profile" {
  description = "AWS Profile to use"
  type        = string
}

#########################################################################################################
## TF Provider Config
#########################################################################################################
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

# Configure the AWS provider
provider "aws" {
  profile = var.aws_profile
  region  = "ca-central-1"
  default_tags {
    tags = {
      ManagedBy = "Terraform"
    }
  }
}

# 
# get Vercel secrets
# 
data "aws_secretsmanager_secret" "vercel_secret" {
  name = "shared/vercel"
}
data "aws_secretsmanager_secret_version" "vercel_secret_version" {
  secret_id = data.aws_secretsmanager_secret.vercel_secret.id
}

locals {
  vercel_api_token = jsondecode(data.aws_secretsmanager_secret_version.vercel_secret_version.secret_string)["tf_token_adpharm_exp_apr_2026"]
}

provider "vercel" {
  api_token = local.vercel_api_token
  team      = "adpharm"
}

# 
# Get the bunny api key from AWS Secrets Manager
# 
data "aws_secretsmanager_secret" "shared_bunny_secrets" {
  name = "shared/bunnynet"
}
data "aws_secretsmanager_secret_version" "shared_bunny_secrets_version" {
  secret_id = data.aws_secretsmanager_secret.shared_bunny_secrets.id
}
locals {
  bunny_api_key = jsondecode(data.aws_secretsmanager_secret_version.shared_bunny_secrets_version.secret_string)["bunny_api_key"]
}

# Configure the BunnyNet Provider
provider "bunnynet" {
  api_key = local.bunny_api_key
}

# 
# get app secrets
# 
data "aws_secretsmanager_secret" "app_secret" {
  name = "adpharm/adpharm-toolshed"
}
data "aws_secretsmanager_secret_version" "app_secret_version" {
  secret_id = data.aws_secretsmanager_secret.app_secret.id
}

locals {
  eventbridge_handler_basic_username_production = jsondecode(data.aws_secretsmanager_secret_version.app_secret_version.secret_string)["eventbridge_handler_basic_username_production"]
  eventbridge_handler_basic_password_production = jsondecode(data.aws_secretsmanager_secret_version.app_secret_version.secret_string)["eventbridge_handler_basic_password_production"]
  eventbridge_handler_basic_username_staging    = jsondecode(data.aws_secretsmanager_secret_version.app_secret_version.secret_string)["eventbridge_handler_basic_username_staging"]
  eventbridge_handler_basic_password_staging    = jsondecode(data.aws_secretsmanager_secret_version.app_secret_version.secret_string)["eventbridge_handler_basic_password_staging"]
  vercel_automation_bypass_secret               = jsondecode(data.aws_secretsmanager_secret_version.app_secret_version.secret_string)["adpharm_toolshed_app_vercel_automation_bypass_secret"]
}

# provider "pinecone" {
#   api_key = local.pinecone_api_key
# }

#########################################################################################################
#########################################################################################################
#########################################################################################################
# 
#                               Vercel Project
# 
#########################################################################################################
#########################################################################################################
#########################################################################################################

# prj_MZiuLkrnUn9C7ABsBQBq2vfje4pX
resource "vercel_project" "app" {
  name = "adpharm-toolshed"

  framework = "react-router"

  git_repository = {
    type = "github"
    repo = "adpharm/adpharm-toolshed"

    # order matters here
    # deploy_hooks = [
    #   {
    #     name = "deploy-main"
    #     ref  = "main"
    #   },
    #   {
    #     name = "deploy-staging"
    #     ref  = "staging"
    #   },
    # ]
  }

  # config i'm adding because it was originally added by the vercel gui
  protection_bypass_for_automation = true
  oidc_token_config = {
    enabled     = true
    issuer_mode = "team"
  }
  skew_protection = "12 hours"
  # enable_affected_projects_deployments = true
}

# 
# Deploy hooks
# 
# locals {
#   sixteenmilevet_deploy_hooks = tolist(vercel_project.sixteenmilevet.git_repository.deploy_hooks)
#   deploy_hook_main            = local.sixteenmilevet_deploy_hooks[0]
#   deploy_hook_staging         = local.sixteenmilevet_deploy_hooks[1]
# }


#########################################################################################################
#########################################################################################################
#########################################################################################################
# 
#                               App Modules
# 
#########################################################################################################

locals {
  # 
  # General
  # 
  system_name = "adpharm-toolshed"

  # 
  # app domains - production
  # 
  app_domains_production = [
    {
      record_name = "tools.",
      root_domain = "adpharm.digital",
    },
  ]
  main_app_fqdn_production = "${local.app_domains_production[0].record_name}${local.app_domains_production[0].root_domain}"

  # 
  # app domains - staging
  # 
  app_domains_staging = [
    {
      record_name = "tools-staging.",
      root_domain = "adpharm.digital",
    },
  ]
  main_app_fqdn_staging = "${local.app_domains_staging[0].record_name}${local.app_domains_staging[0].root_domain}"

  # the source name that will trigger the app eventbridge event handler
  eventbridge_source_name_to_trigger_app_eventbridge_handler = "app"
}


# 
# 
# Event Bridges
# 
# 
module "event_bridge_production" {
  source = "./modules/eventbridge"
  settings = {
    system_name     = local.system_name
    git_branch_name = "main"
    app_eventbridge_handler = {
      basic_username                     = local.eventbridge_handler_basic_username_production
      basic_password                     = local.eventbridge_handler_basic_password_production
      invocation_endpoint                = "https://${local.main_app_fqdn_production}/eventbridge-api/v1/handler"
      eventbridge_source_for_this_target = local.eventbridge_source_name_to_trigger_app_eventbridge_handler
    }
  }
}

module "event_bridge_staging" {
  source = "./modules/eventbridge"
  settings = {
    system_name     = local.system_name
    git_branch_name = "staging"
    app_eventbridge_handler = {
      basic_username                     = local.eventbridge_handler_basic_username_staging
      basic_password                     = local.eventbridge_handler_basic_password_staging
      invocation_endpoint                = "https://${local.main_app_fqdn_staging}/eventbridge-api/v1/handler"
      eventbridge_source_for_this_target = local.eventbridge_source_name_to_trigger_app_eventbridge_handler
      vercel_automation_bypass_secret    = local.vercel_automation_bypass_secret
    }
  }
}

# 
# 
# Main
# 
# 

module "production" {
  source = "./modules/main"

  settings = {
    # 
    # General
    # 
    system_name = local.system_name
    # system_env_name = "production" # optional, default is the git branch name

    # 
    # App settings
    # 
    vercel_project_id    = vercel_project.app.id
    git_branch_name      = "main"
    event_bridge_bus_arn = module.event_bridge_production.event_bus_arn
    app_domains          = local.app_domains_production
    # pinecone_api_key     = local.pinecone_api_key

    # 
    # CDN settings
    # 
    bunny_cdn_domains = [
      {
        record_name = "media.tools.",
        root_domain = "adpharm.digital",
      },
    ]
  }

  extra_env_vars_to_add = {
    EVENTBRIDGE_HANDLER_BASIC_USERNAME = {
      comment = "Username for the EventBridge handler"
      value   = local.eventbridge_handler_basic_username_production
    }
    EVENTBRIDGE_HANDLER_BASIC_PASSWORD = {
      comment = "Password for the EventBridge handler"
      value   = local.eventbridge_handler_basic_password_production
    }
    EVENT_BRIDGE_BUS_NAME = {
      comment = "Event Bridge bus name"
      value   = module.event_bridge_production.event_bus_name
    }
    EVENTBRIDGE_SOURCE_NAME_TO_TRIGGER_APP_EVENTBRIDGE_HANDLER = {
      comment = "Source name to trigger the app eventbridge event handler"
      value   = local.eventbridge_source_name_to_trigger_app_eventbridge_handler
    }
  }
}

module "staging" {
  source = "./modules/main"

  settings = {
    # 
    # General
    # 
    system_name = local.system_name
    # system_env_name = "staging" # optional, default is the git branch name

    # 
    # App settings
    # 
    vercel_project_id = vercel_project.app.id
    git_branch_name   = "staging"

    app_domains          = local.app_domains_staging
    event_bridge_bus_arn = module.event_bridge_staging.event_bus_arn
    # pinecone_api_key     = local.pinecone_api_key

    # 
    # CDN settings
    # 
    bunny_cdn_domains = [
      {
        record_name = "media.tools-staging.",
        root_domain = "adpharm.digital",
      },
    ]
  }

  extra_env_vars_to_add = {
    EVENTBRIDGE_HANDLER_BASIC_USERNAME = {
      comment = "Username for the EventBridge handler"
      value   = local.eventbridge_handler_basic_username_staging
    }
    EVENTBRIDGE_HANDLER_BASIC_PASSWORD = {
      comment = "Password for the EventBridge handler"
      value   = local.eventbridge_handler_basic_password_staging
    }
    EVENT_BRIDGE_BUS_NAME = {
      comment = "Event Bridge bus name"
      value   = module.event_bridge_staging.event_bus_name
    }
    EVENTBRIDGE_SOURCE_NAME_TO_TRIGGER_APP_EVENTBRIDGE_HANDLER = {
      comment = "Source name to trigger the app eventbridge event handler"
      value   = local.eventbridge_source_name_to_trigger_app_eventbridge_handler
    }
  }
}
