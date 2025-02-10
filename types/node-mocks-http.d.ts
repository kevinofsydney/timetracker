declare module 'node-mocks-http' {
  import { NextRequest } from 'next/server'
  
  interface RequestOptions {
    method?: string
    url?: string
    headers?: Record<string, string>
    body?: any
  }

  interface MockRequest extends NextRequest {}

  function createRequest(options?: RequestOptions): MockRequest
  function createResponse(): any

  export default {
    createRequest,
    createResponse,
  }
} 