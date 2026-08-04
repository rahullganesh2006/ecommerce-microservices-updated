resource "aws_cloudwatch_dashboard" "main_dashboard" {
  dashboard_name = "${var.project_name}-dashboard"

  dashboard_body = jsonencode({
    widgets = [
      // -----------------------------------------------------
      // 1. API GATEWAY METRICS
      // -----------------------------------------------------
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/ApiGateway", "Count", "ApiName", "${var.project_name}-api", { "label": "No. of Requests" }],
            [".", "4XXError", ".", ".", { "label": "4xx Errors", "color": "#ff7f0e" }],
            [".", "5XXError", ".", ".", { "label": "5xx Errors", "color": "#d62728" }]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "API Gateway: Requests & Errors"
          period  = 300
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 0
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/ApiGateway", "Latency", "ApiName", "${var.project_name}-api", { "label": "Latency (ms)", "stat": "Average" }]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "API Gateway: Latency"
          period  = 300
        }
      },

      // -----------------------------------------------------
      // 2. LAMBDA METRICS
      // -----------------------------------------------------
      {
        type   = "metric"
        x      = 0
        y      = 6
        width  = 12
        height = 6
        properties = {
          metrics = [
            for svc in tolist(var.services) :
            ["AWS/Lambda", "Invocations", "FunctionName", "${var.project_name}-${svc}"]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "Lambda: Volume of Traffic (Invocations)"
          period  = 300
          stat    = "Sum"
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 6
        width  = 12
        height = 6
        properties = {
          metrics = flatten([
            [for svc in tolist(var.services) : ["AWS/Lambda", "Errors", "FunctionName", "${var.project_name}-${svc}"]],
            [for svc in tolist(var.services) : ["AWS/Lambda", "Throttles", "FunctionName", "${var.project_name}-${svc}"]]
          ])
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "Lambda: Errors & Throttles"
          period  = 300
          stat    = "Sum"
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 12
        width  = 24
        height = 6
        properties = {
          metrics = [
            for svc in tolist(var.services) :
            ["AWS/Lambda", "Duration", "FunctionName", "${var.project_name}-${svc}"]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "Lambda: Duration to Respond (ms)"
          period  = 300
          stat    = "Average"
        }
      },

      // -----------------------------------------------------
      // 3. DYNAMODB METRICS
      // -----------------------------------------------------
      {
        type   = "metric"
        x      = 0
        y      = 18
        width  = 12
        height = 6
        properties = {
          metrics = flatten([
            [for svc in tolist(var.services) : ["AWS/DynamoDB", "ConsumedReadCapacityUnits", "TableName", "rahull-${svc}"]],
            [for svc in tolist(var.services) : ["AWS/DynamoDB", "ConsumedWriteCapacityUnits", "TableName", "rahull-${svc}"]]
          ])
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "DynamoDB: Read/Write Load"
          period  = 300
          stat    = "Sum"
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 18
        width  = 12
        height = 6
        properties = {
          metrics = flatten([
            [for svc in tolist(var.services) : ["AWS/DynamoDB", "SystemErrors", "TableName", "rahull-${svc}"]],
            [for svc in tolist(var.services) : ["AWS/DynamoDB", "UserErrors", "TableName", "rahull-${svc}"]]
          ])
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "DynamoDB: Internal DB Errors"
          period  = 300
          stat    = "Sum"
        }
      },

      // -----------------------------------------------------
      // 4. SNS METRICS
      // -----------------------------------------------------
      {
        type   = "metric"
        x      = 0
        y      = 24
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/SNS", "NumberOfMessagesPublished", "TopicName", "${var.project_name}-topic"],
            [".", "NumberOfNotificationsDelivered", ".", "."]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "SNS: Published & Delivered Messages"
          period  = 300
          stat    = "Sum"
        }
      },

      // -----------------------------------------------------
      // 5. SQS METRICS
      // -----------------------------------------------------
      {
        type   = "metric"
        x      = 12
        y      = 24
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/SQS", "ApproximateNumberOfMessagesVisible", "QueueName", "${var.project_name}-queue"],
            [".", "ApproximateAgeOfOldestMessage", ".", "."]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "SQS: Visible Messages & Avg Age"
          period  = 300
          stat    = "Average"
        }
      }
    ]
  })
}
