variable "aws_region" {
  type        = string
  description = "AWS region to deploy resources"
  default     = "us-east-1"
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

variable "project_name" {
  description = "Name of the project"
  default     = "angadi-hub"
}

variable "services" {
  description = "List of backend services"
  type        = set(string)
  default     = ["auth-service", "cart-service", "inventory-service", "notification-service", "order-service", "payment-service", "product-service"]
}