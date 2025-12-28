resource "aws_ecr_repository" "services" {
  for_each = toset(["auth", "listing", "payment"])
  name     = "${var.project_name}/${each.key}"
}

resource "aws_apprunner_service" "services" {
  for_each = toset(["auth", "listing", "payment"])

  service_name = "${var.project_name}-${each.key}"

  source_configuration {
    auto_deployments_enabled = false

    image_repository {
      image_identifier      = "public.ecr.aws/aws-containers/hello-app-runner:latest" # Placeholder until images are pushed
      image_repository_type = "ECR_PUBLIC" 
      # For private ECR:
      # image_identifier = "${aws_ecr_repository.services[each.key].repository_url}:latest"
      # image_repository_type = "ECR"
      # image_configuration {
      #   port = (each.key == "auth" ? "3001" : (each.key == "listing" ? "3002" : "3003"))
      # }
    }
  }

  depends_on = [aws_ecr_repository.services]
}

# Output the Repository URLs to push to
output "ecr_repository_urls" {
  value = { for k, v in aws_ecr_repository.services : k => v.repository_url }
}
