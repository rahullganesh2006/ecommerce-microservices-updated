output "deployed_lambdas" {
  value = [
    data.aws_lambda_function.product.function_name,
    data.aws_lambda_function.cart.function_name,
    data.aws_lambda_function.inventory.function_name,
    data.aws_lambda_function.order.function_name,
    data.aws_lambda_function.payment.function_name,
  ]
  description = "The 5 Lambda functions updated."
}
