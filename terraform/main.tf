# AWS Academy Microservices Deployment Setup

locals {
  product_function_name   = data.aws_lambda_function.product.function_name
  cart_function_name      = data.aws_lambda_function.cart.function_name
  inventory_function_name = data.aws_lambda_function.inventory.function_name
  order_function_name     = data.aws_lambda_function.order.function_name
  payment_function_name   = data.aws_lambda_function.payment.function_name
}