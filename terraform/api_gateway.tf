resource "aws_apigatewayv2_api" "http_api" {
  name          = "${var.project_name}-http-api"
  protocol_type = "HTTP"
  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["*"]
    allow_headers = ["*"]
  }
}

resource "aws_apigatewayv2_stage" "v1" {
  api_id      = aws_apigatewayv2_api.http_api.id
  name        = "v1"
  auto_deploy = true
}

# Create a mapping between the service name and the path prefix
locals {
  service_prefixes = {
    "auth-service"         = "/auth"
    "cart-service"         = "/cart"
    "inventory-service"    = "/inventory"
    "notification-service" = "/notifications"
    "order-service"        = "/orders"
    "payment-service"      = "/payments"
    "product-service"      = "/products"
  }
}

resource "aws_apigatewayv2_integration" "lambda_integration" {
  for_each = var.services

  api_id             = aws_apigatewayv2_api.http_api.id
  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.services[each.key].invoke_arn
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "service_routes" {
  for_each = var.services

  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "ANY ${local.service_prefixes[each.key]}/{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration[each.key].id}"
}

# Also map the base prefix itself
resource "aws_apigatewayv2_route" "service_routes_base" {
  for_each = var.services

  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "ANY ${local.service_prefixes[each.key]}"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration[each.key].id}"
}

resource "aws_lambda_permission" "apigw" {
  for_each = var.services

  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.services[each.key].function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http_api.execution_arn}/*/*"
}

output "api_endpoint" {
  value = aws_apigatewayv2_stage.v1.invoke_url
}
