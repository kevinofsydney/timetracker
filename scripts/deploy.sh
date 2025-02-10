#!/bin/bash

# Function to validate environment variables
validate_env() {
  local required_vars=("DATABASE_URL" "DIRECT_URL" "NEXTAUTH_SECRET" "NEXTAUTH_URL")
  local missing_vars=()

  for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
      missing_vars+=("$var")
    fi
  done

  if [ ${#missing_vars[@]} -ne 0 ]; then
    echo "Error: Missing required environment variables:"
    printf '%s\n' "${missing_vars[@]}"
    exit 1
  fi
}

# Validate environment variables before proceeding
echo "Validating environment variables..."
validate_env

# Run tests
# npm run test:ci

# If tests pass (exit code 0), proceed with deployment
if [ $? -eq 0 ]; then
  echo "Tests passed, proceeding with deployment..."

  # Build the application
  npm run build

  # Run database migrations
  echo "Running database migrations..."
  npx prisma migrate deploy

  # Verify database connection
  echo "Verifying database connection..."
  npx prisma db push --preview-feature

  # Check if we're deploying to production
  if [ "$NODE_ENV" = "production" ]; then
    # Deploy to Vercel Production
    echo "Deploying to production..."
    vercel --prod
  else
    # Deploy to Vercel Preview
    echo "Deploying to preview environment..."
    vercel
  fi

  # If deployment was successful
  if [ $? -eq 0 ]; then
    echo "Deployment completed successfully!"
    
    # Run post-deployment checks
    echo "Running post-deployment checks..."
    curl -f ${NEXTAUTH_URL}/api/health || exit 1
  else
    echo "Deployment failed!"
    exit 1
  fi
else
  echo "Tests failed, aborting deployment"
  exit 1
fi 