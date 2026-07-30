variable "aws_region" {
  type        = string
  description = "AWS region to deploy resources"
  default     = "ap-southeast-1"
}

variable "resource_prefix" {
  type        = string
  description = "Prefix prepended to DynamoDB tables and resources"
  default     = "rahull"
}

variable "use_existing_lab_role" {
  type        = bool
  description = "Set to true if deploying inside an AWS Academy Sandbox to bypass creating IAM roles"
  default     = false
}

variable "existing_lab_role_arn" {
  type        = string
  description = "ARN of the pre-created LabRole if use_existing_lab_role is true"
  default     = ""
}