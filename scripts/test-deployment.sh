#!/bin/bash

# Run database migrations on test database
echo "Running migrations..."
DATABASE_URL=$TEST_DATABASE_URL npx prisma migrate deploy

# Run tests
echo "Running tests..."
npm run test:ci

# If tests pass, proceed with deployment checks
if [ $? -eq 0 ]; then
  echo "Tests passed, checking build..."
  
  # Check if the build succeeds
  npm run build
  
  if [ $? -eq 0 ]; then
    echo "Build successful!"
    echo "Ready for deployment"
    exit 0
  else
    echo "Build failed!"
    exit 1
  fi
else
  echo "Tests failed!"
  exit 1
fi 