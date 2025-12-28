resource "aws_s3_bucket" "listings" {
  bucket = "${var.project_name}-listings-${random_string.suffix.result}"
}

resource "random_string" "suffix" {
  length  = 8
  special = false
  upper   = false
}

resource "aws_s3_bucket_public_access_block" "listings" {
  bucket = aws_s3_bucket.listings.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_cors_configuration" "listings" {
  bucket = aws_s3_bucket.listings.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "GET"]
    allowed_origins = ["*"] # Restrict to mobile app domain/scheme in prod
    expose_headers  = []
    max_age_seconds = 3000
  }
}
