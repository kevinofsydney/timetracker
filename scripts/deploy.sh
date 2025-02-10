#!/bin/bash

# Run tests
npm run test:ci

# If tests pass (exit code 0), proceed with deployment
if [ $? -eq 0 ]; then
  echo "Tests passed, proceeding with deployment..."

  # Build the application
  npm run build

  # Run database migrations
  npx prisma migrate deploy

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
    
    # Optional: Run database seed if needed
    # npm run db:seed
  else
    echo "Deployment failed!"
    exit 1
  fi
else
  echo "Tests failed, aborting deployment"
  exit 1
fi 