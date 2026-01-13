# Require provider
terraform {
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 3.7"
    }
  }
}

#########################################################################################################
##                                        Variables                                                     
########################################################################################################

variable "vercel_settings" {
  description = "Settings for the Vercel"
  type = object({
    vercel_project_id = string
    git_branch_name   = string
    domains = list(object({
      record_name          = string
      root_domain          = string
      redirect_to          = optional(string)
      redirect_status_code = optional(number)
    }))
    git_branch_hook_url = optional(string)
  })
}

# 
# Env vars to add
# 
variable "env_vars_to_add" {
  description = "Environment variables to add to Vercel"
  type = map(object({
    comment   = optional(string)
    value     = string
    sensitive = optional(bool)
  }))
  default = {}
}

locals {
  # if the git branch name is "main" or "master", then we need to create a custom environment
  is_main = var.vercel_settings.git_branch_name == "main" || var.vercel_settings.git_branch_name == "master"
}

# 
# Vercel Custom Environment (for any branch other than "main" or "master")
# 
resource "vercel_custom_environment" "custom_environment" {
  count       = local.is_main ? 0 : 1 # only create the custom environment for any non-main branch
  project_id  = var.vercel_settings.vercel_project_id
  name        = var.vercel_settings.git_branch_name
  description = "Custom environment for ${var.vercel_settings.git_branch_name}"
  branch_tracking = {
    pattern = var.vercel_settings.git_branch_name
    type    = "equals"
  }
}

# 
# Vercel Project Domains
# 
resource "vercel_project_domain" "domain" {
  # if the branch is main: for each domain in the vercel_settings, create a domain
  # for_each   = tomap(local.is_main ? var.vercel_settings.domains : [])
  for_each = {
    for index, domain in local.is_main ? var.vercel_settings.domains : [] : domain.record_name => domain
  }
  project_id           = var.vercel_settings.vercel_project_id
  domain               = "${each.value.record_name}${each.value.root_domain}"
  redirect             = each.value.redirect_to
  redirect_status_code = each.value.redirect_status_code
}

# 
# Vercel Project Domains (for custom environments)
# 
resource "vercel_project_domain" "custom_environment_domain" {
  # for_each              = toset(local.is_main ? [] : var.vercel_settings.domains)
  for_each = {
    for index, domain in local.is_main ? [] : var.vercel_settings.domains : domain.record_name => domain
  }
  project_id            = var.vercel_settings.vercel_project_id
  domain                = "${each.value.record_name}${each.value.root_domain}"
  custom_environment_id = vercel_custom_environment.custom_environment[0].id
  redirect              = each.value.redirect_to
  redirect_status_code  = each.value.redirect_status_code

  depends_on = [
    vercel_custom_environment.custom_environment
  ]
}

# # 
# # Vercel Project Domains
# # 
# resource "vercel_project_domain" "domain" {
#   count      = local.is_main ? 1 : 0 # only create the domain for the main branch
#   project_id = var.vercel_settings.vercel_project_id
#   domain     = var.vercel_settings.fqdn
# }

# # 
# # Vercel Project Domains (for custom environments)
# # 
# resource "vercel_project_domain" "custom_environment_domain" {
#   count                 = local.is_main ? 0 : 1 # only create the domain for the custom environment
#   project_id            = var.vercel_settings.vercel_project_id
#   domain                = var.vercel_settings.fqdn
#   custom_environment_id = vercel_custom_environment.custom_environment[0].id

#   depends_on = [
#     vercel_custom_environment.custom_environment
#   ]
# }

# 
# Vercel Environment Variables for Event Gateway (for custom environments)
# 
locals {
  # add the "target" and "custom_environment_ids" to the extra_env_vars_to_add
  env_vars_to_add = {
    for key, value in var.env_vars_to_add : key => merge(value, {
      # this line says:
      #   if the environment is main, then the target is production
      #   if the environment is not main, and the value is not sensitive, then the target is development
      #   if the environment is not main, and the value is sensitive, then the target is an empty list
      # we do this so that we can `vercel env pull` and grab the dev non-sensitive env vars
      target                 = local.is_main ? ["production"] : value.sensitive == true ? [] : ["development"]
      custom_environment_ids = local.is_main ? null : [vercel_custom_environment.custom_environment[0].id]
    })
  }
}

resource "vercel_project_environment_variable" "vercel_env_vars" {
  for_each = local.env_vars_to_add

  project_id             = var.vercel_settings.vercel_project_id
  key                    = each.key
  value                  = each.value.value
  target                 = each.value.target
  custom_environment_ids = each.value.custom_environment_ids
  sensitive              = lookup(each.value, "sensitive", false)
  comment                = "${lookup(each.value, "comment", "")} - managed by TF"

  depends_on = [
    vercel_custom_environment.custom_environment
  ]
}


# 
# Trigger a deployment whenever the environment variables change
# 
# resource "terraform_data" "trigger_deployment" {
#   count = var.vercel_settings.git_branch_hook_url == null ? 0 : 1

#   # We hash the key=value pairs into one string: any change → new hash → re‑run
#   triggers_replace = {
#     env_signature = sha256(join(",", [
#       for key, value in local.env_vars_to_add :
#       "${key}=${value.value}"
#     ]))
#   }

#   # 
#   # Trigger the deployment by POSTing
#   # 
#   provisioner "local-exec" {
#     command = var.vercel_settings.git_branch_hook_url == null ? null : "curl -X POST ${var.vercel_settings.git_branch_hook_url}"
#   }

#   depends_on = [
#     vercel_project_environment_variable.vercel_env_vars
#   ]
# }

#########################################################################################################
##                                        Outputs                                                     
########################################################################################################

output "custom_environment_id" {
  description = "The ID of the Vercel custom environment"
  value       = local.is_main ? null : vercel_custom_environment.custom_environment[0].id
}

# output "protection_bypass_for_automation_secret" {
#   description = "The protection bypass for automation secret"
#   value       = data.vercel_project._.protection_bypass_for_automation_secret
# }

