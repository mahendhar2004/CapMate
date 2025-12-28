variable "aws_region" {
  description = "AWS Region"
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project Name"
  default     = "capmate"
}

variable "db_password" {
  description = "Database Password"
  type        = string
  sensitive   = true
}
