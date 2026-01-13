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
  }
}

#########################################################################################################
##                                        Variables                                                     
########################################################################################################

# 
# settings
# 
variable "settings" {
  description = "Settings for the Event Bridge"
  type = object({
    # 
    # General
    # 
    system_name = string

    # 
    # Specific settings
    # 
    git_branch_name = string
    # api destinations
    app_eventbridge_handler = object({
      basic_username                     = string,
      basic_password                     = string,
      invocation_endpoint                = string,
      eventbridge_source_for_this_target = string,
      vercel_automation_bypass_secret    = optional(string)
    })

    # 
    # git_branch_name = string
    # fqdn            = string
    # # the event store api username
    # event_store_api_username = string
    # # the event store api password
    # event_store_api_password = string
    # # the event store api ingest endpoint
    # event_store_api_ingest_endpoint = string
    # # the event store api vercel automation bypass secret
    # event_store_api_vercel_automation_bypass_secret = optional(string)
    # # the git branch hook url
    # git_branch_hook_url = optional(string)
    # # the dlq notification email
    # dlq_notification_email = string
    # # the event source for the silo cdp retryer
    # event_bus_source_silo_cdp_retryer = string

    # # 
    # # Event Store API - Unify
    # # 
    # event_store_api_unify_ingest_endpoint = string
  })

  validation {
    # git branch name must contain only lowercase letters, numbers, and hyphens
    condition     = can(regex("^[a-z0-9-]+$", var.settings.git_branch_name))
    error_message = "The git branch name must contain only lowercase letters, numbers, and hyphens"
  }
}

# 
# Env vars to add
# 
variable "extra_env_vars_to_add" {
  description = "Environment variables to add"
  type = map(object({
    comment   = optional(string)
    value     = string
    sensitive = optional(bool)
  }))
  default = {}
}

#########################################################################################################
##                                                                                             
########################################################################################################


# 
# EventBridge Remote Module
#   src: https://github.com/terraform-aws-modules/terraform-aws-eventbridge/blob/v3.14.5/main.tf
#   complete example: https://github.com/terraform-aws-modules/terraform-aws-eventbridge/blob/v3.14.5/examples/complete/main.tf
# 
locals {

  # 
  local_settings = {
    event_bus_name_with_branch = "${var.settings.system_name}-bus-${var.settings.git_branch_name}"
  }

  sanitized_system_name     = replace(var.settings.system_name, "-", "_")
  sanitized_git_branch_name = replace(var.settings.git_branch_name, "-", "_")

  # 
  # 
  # 
  connections_ = {
    # 
    # App EventBridge Event Handler
    # 
    app_eventbridge_handler = {
      authorization_type = "BASIC" # One of API_KEY,BASIC,OAUTH_CLIENT_CREDENTIALS

      auth_parameters = {
        basic = {
          # Header Name
          username = var.settings.app_eventbridge_handler.basic_username
          # Header Value. Created and stored in AWS Secrets Manager.
          password = var.settings.app_eventbridge_handler.basic_password
        }

        invocation_http_parameters = var.settings.app_eventbridge_handler.vercel_automation_bypass_secret != null ? {
          header = [{
            key             = "x-vercel-protection-bypass"
            value           = var.settings.app_eventbridge_handler.vercel_automation_bypass_secret
            is_value_secret = true
          }]
        } : null
      }
    }

    # 
    # Other Connections here...
    # 
  }

  # we sanitize the connection name to avoid conflicts with other connections
  # we have to do it this way because of these lines in the eventbridge module:
  # https://github.com/terraform-aws-modules/terraform-aws-eventbridge/blob/v3.14.5/main.tf#L22C3-L28C5
  sanitized_connections = {
    for k, v in local.connections_ :
    "${k}_${local.sanitized_system_name}_${local.sanitized_git_branch_name}" => v
  }

  api_destinations_ = {
    # 
    # App EventBridge Event Handler
    # 
    app_eventbridge_handler = {
      description                      = "App EventBridge Event Handler"
      invocation_endpoint              = var.settings.app_eventbridge_handler.invocation_endpoint
      http_method                      = "POST"
      invocation_rate_limit_per_second = 20
    }

    # 
    # Other API Destinations here...
    # 
  }

  sanitized_api_destinations = {
    for k, v in local.api_destinations_ :
    "${k}_${local.sanitized_system_name}_${local.sanitized_git_branch_name}" => v
  }
}

module "eventbridge" {
  source = "terraform-aws-modules/eventbridge/aws"

  create_bus              = true
  create_connections      = true
  create_api_destinations = true

  bus_name        = local.local_settings.event_bus_name_with_branch
  bus_description = "Event Bus for ${local.local_settings.event_bus_name_with_branch}"

  attach_api_destination_policy = true


  rules = {
    # 
    # App EventBridge Event Handler
    # 
    app_eventbridge_handler = {
      description = "Send events to the App EventBridge Event Handler"
      event_pattern = jsonencode({
        "source" : [var.settings.app_eventbridge_handler.eventbridge_source_for_this_target],
      })
      enabled = true
    }

    # 
    # Other Event Bus Sources here...
    # 
  }

  targets = {
    app_eventbridge_handler = [
      {
        # name            = "${replace("app_eventbridge_handler_${var.settings.git_branch_name}", "_", "-")}-destination"
        # destination     = "${replace("app_eventbridge_handler_${var.settings.git_branch_name}", "_", "-")}-destination" # this has to match the destination name
        name            = "app_eventbridge_handler_${local.sanitized_system_name}_${local.sanitized_git_branch_name}"
        destination     = "app_eventbridge_handler_${local.sanitized_system_name}_${local.sanitized_git_branch_name}"
        attach_role_arn = true
        dead_letter_arn = aws_sqs_queue.dlq.arn
        retry_policy = {
          # stop retrying after N times
          # N retries = N+1 attempts
          maximum_retry_attempts = 10
          # stop retrying after 1 hour
          #   > I think we want this to be decently long because we could have a backlog of events
          #   > but we also don't want to wait forever
          maximum_event_age_in_seconds = 3600
        }
      }
    ]

    # 
    # Other Targets here...
    # 
  }

  connections      = local.sanitized_connections
  api_destinations = local.sanitized_api_destinations

  tags = {
    Name = "${local.local_settings.event_bus_name_with_branch}"
  }
}

#########################################################################################################
# SNS Topic and Subscription for DLQ for app_eventbridge_handler
########################################################################################################
# 
# SNS Topic and Subscription using Terraform AWS Module
#   Source: https://github.com/terraform-aws-modules/terraform-aws-sns
# 
module "sns" {
  source  = "terraform-aws-modules/sns/aws"
  version = "~> 6.1" # Use an appropriate version constraint

  name = "${local.local_settings.event_bus_name_with_branch}-dlq-notifications"

  subscriptions = {
    # Using "email" here as an example key, you can name it descriptively
    email = {
      protocol               = "email"
      endpoint               = "ben@theadpharm.com"
      endpoint_auto_confirms = true
      # endpoint_auto_confirms = false # Default is false for email/email-json
    }
    # Add other subscriptions here if needed (e.g., for Slack via Chatbot, Lambda, etc.)
    # slack = {
    #   protocol = "https"
    #   endpoint = "your-chatbot-webhook-or-lambda-arn"
    #   endpoint_auto_confirms = true # Usually true for HTTPS endpoints you control
    # }
  }

  tags = {
    Name = "${local.local_settings.event_bus_name_with_branch}-dlq-notifications"
    # Add other relevant tags
  }
}

# 
# CloudWatch Metric Alarm using Terraform AWS Module
#   Source: https://github.com/terraform-aws-modules/terraform-aws-cloudwatch
# 
module "dlq_metric_alarm" {
  source  = "terraform-aws-modules/cloudwatch/aws//modules/metric-alarm"
  version = "~> 5.7" # Use an appropriate version constraint

  alarm_name          = "${local.local_settings.event_bus_name_with_branch}-dlq-not-empty-alarm"
  alarm_description   = "Alarm triggered when messages are present in the ${local.local_settings.event_bus_name_with_branch} DLQ."
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  threshold           = 0
  treat_missing_data  = "notBreaching"

  # Metric details
  metric_name = "ApproximateNumberOfMessagesVisible"
  namespace   = "AWS/SQS"
  period      = 60    # Check every 60 seconds
  statistic   = "Sum" # Sum or Maximum works for checking > 0

  # Dimensions identify the specific SQS queue
  dimensions = {
    QueueName = aws_sqs_queue.dlq.name
  }

  # Actions to take when alarm state is reached
  alarm_actions = [module.sns.topic_arn]
  ok_actions    = [module.sns.topic_arn] # Optional: Notify when the alarm state returns to OK

  tags = {
    Name = "${local.local_settings.event_bus_name_with_branch}-dlq-alarm"
    # Add other relevant tags
  }
}

# 
# create a dead letter queue (dlq)
# 
resource "aws_sqs_queue" "dlq" {
  name = "${local.local_settings.event_bus_name_with_branch}-dlq"
}

# 
# allow eventbridge to send messages to the dlq
# 
resource "aws_sqs_queue_policy" "dlq" {
  queue_url = aws_sqs_queue.dlq.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "sqs:SendMessage"
        ]
        Effect = "Allow"
        Resource = [
          aws_sqs_queue.dlq.arn
        ]
        Principal = {
          Service = "events.amazonaws.com"
        }
      },
    ]
  })
}


#########################################################################################################
##                                       Outputs                                                      
########################################################################################################

output "event_bus_name" {
  description = "The name of the event bus"
  value       = module.eventbridge.eventbridge_bus_name
}

output "event_bus_arn" {
  description = "The ARN of the event bus"
  value       = module.eventbridge.eventbridge_bus_arn
}

output "dlq_url" {
  description = "The URL of the dead letter queue"
  value       = aws_sqs_queue.dlq.url
}

output "dlq_arn" {
  description = "The ARN of the dead letter queue"
  value       = aws_sqs_queue.dlq.arn
}


