# Pre-existing Lambda Data Sources
data "aws_lambda_function" "product" {
  function_name = "rahull-product-service-final"
}

data "aws_lambda_function" "cart" {
  function_name = "rahull-cart-service-final"
}

data "aws_lambda_function" "inventory" {
  function_name = "rahull-inventory-service-final"
}

data "aws_lambda_function" "order" {
  function_name = "rahull-order-service-final"
}

data "aws_lambda_function" "payment" {
  function_name = "rahull-payment-service-final"
}

# Update Lambda function code
resource "null_resource" "update_product" {
  triggers = {
    hash = filebase64sha256("${path.module}/../product-service/lambda_package.zip")
  }
  provisioner "local-exec" {
    command = "aws lambda update-function-code --function-name ${data.aws_lambda_function.product.function_name} --zip-file fileb://${path.module}/../product-service/lambda_package.zip --region ${var.aws_region}"
  }
}

resource "null_resource" "update_cart" {
  triggers = {
    hash = filebase64sha256("${path.module}/../cart-service/lambda_package.zip")
  }
  provisioner "local-exec" {
    command = "aws lambda update-function-code --function-name ${data.aws_lambda_function.cart.function_name} --zip-file fileb://${path.module}/../cart-service/lambda_package.zip --region ${var.aws_region}"
  }
}

resource "null_resource" "update_inventory" {
  triggers = {
    hash = filebase64sha256("${path.module}/../inventory-service/lambda_package.zip")
  }
  provisioner "local-exec" {
    command = "aws lambda update-function-code --function-name ${data.aws_lambda_function.inventory.function_name} --zip-file fileb://${path.module}/../inventory-service/lambda_package.zip --region ${var.aws_region}"
  }
}

resource "null_resource" "update_order" {
  triggers = {
    hash = filebase64sha256("${path.module}/../order-service/lambda_package.zip")
  }
  provisioner "local-exec" {
    command = "aws lambda update-function-code --function-name ${data.aws_lambda_function.order.function_name} --zip-file fileb://${path.module}/../order-service/lambda_package.zip --region ${var.aws_region}"
  }
}

resource "null_resource" "update_payment" {
  triggers = {
    hash = filebase64sha256("${path.module}/../payment-service/lambda_package.zip")
  }
  provisioner "local-exec" {
    command = "aws lambda update-function-code --function-name ${data.aws_lambda_function.payment.function_name} --zip-file fileb://${path.module}/../payment-service/lambda_package.zip --region ${var.aws_region}"
  }
}
