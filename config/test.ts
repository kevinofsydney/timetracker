export const config = {
  database: {
    url: process.env.TEST_DATABASE_URL,
  },
  auth: {
    secret: 'test-secret',
    url: 'http://localhost:3000',
  },
} 