# IAM Role for Lambda Execution (only created if not using pre-existing sandbox role)
resource "aws_iam_role" "lambda_exec" {
  count = var.use_existing_lab_role ? 0 : 1
  name  = "${var.resource_prefix}-lambda-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

# Attach basic execution logs permissions (only created if not using pre-existing sandbox role)
resource "aws_iam_role_policy_attachment" "lambda_logs" {
  count      = var.use_existing_lab_role ? 0 : 1
  role       = aws_iam_role.lambda_exec[0].name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Attach DynamoDB Access Policy (only created if not using pre-existing sandbox role)
resource "aws_iam_policy" "dynamodb_access" {
  count       = var.use_existing_lab_role ? 0 : 1
  name        = "${var.resource_prefix}-dynamodb-access-policy"
  description = "Allows full access to DynamoDB tables for this microservices group"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:BatchGetItem",
          "dynamodb:BatchWriteItem",
          "dynamodb:PutItem",
          "dynamodb:DeleteItem",
          "dynamodb:GetItem",
          "dynamodb:Scan",
          "dynamodb:Query",
          "dynamodb:UpdateItem"
        ]
        Resource = [
          "arn:aws:dynamodb:*:*:table/${var.resource_prefix}-*"
        ]
      }
    ]
  })
}

# Attach the DynamoDB access policy to the role (only created if not using pre-existing sandbox role)
resource "aws_iam_role_policy_attachment" "lambda_dynamodb" {
  count      = var.use_existing_lab_role ? 0 : 1
  role       = aws_iam_role.lambda_exec[0].name
  policy_arn = aws_iam_policy.dynamodb_access[0].arn
}

# Local variable resolution for function execution role
locals {
  lambda_role_arn = var.use_existing_lab_role ? var.existing_lab_role_arn : aws_iam_role.lambda_exec[0].arn
}
