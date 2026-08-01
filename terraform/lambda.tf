# We'll use a dummy zip file for initial creation.
# CI/CD will update the Lambda code later.
data "archive_file" "dummy_lambda" {
  type        = "zip"
  output_path = "${path.module}/dummy.zip"
  
  source {
    content  = "def handler(event, context):\n    return {'statusCode': 200, 'body': 'Not initialized'}"
    filename = "app.py"
  }
}

resource "aws_lambda_function" "services" {
  for_each = var.services

  function_name = "${var.project_name}-${each.key}"
  role          = aws_iam_role.lambda_exec_role.arn
  handler       = "app.handler"
  runtime       = "python3.11"
  timeout       = 30
  memory_size   = 256

  filename         = data.archive_file.dummy_lambda.output_path
  source_code_hash = data.archive_file.dummy_lambda.output_base64sha256

  environment {
    variables = {
      ENVIRONMENT = "production"
    }
  }

  lifecycle {
    ignore_changes = [
      filename,
      source_code_hash,
      environment
    ]
  }
}
