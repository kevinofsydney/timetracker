# Translator Time Tracking Application

## Description

This web-based application is designed to facilitate efficient time tracking for translators and administrators. It enables translators to clock in and out of shifts, select shift types, and view their working hours. Administrators can generate detailed reports, adjust hours, and manage user accounts. The application ensures accurate payroll calculations based on predefined rates and supports both mobile and desktop platforms.

## Table of Contents

- [Features](#features)
- [Technical Requirements](#technical-requirements)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

### User Authentication & Access Control

- **Email-Based Authentication:** Translators and administrators sign in using email and password credentials.
- **Password Management:** Administrators have the ability to reset passwords for translators.
- **Role-Based Access:** System differentiates access levels, allowing only administrators to generate reports and manage user accounts.

### Clock-In/Clock-Out System

- **Web-Based Interface:** Translators can clock in and out through a responsive web application.
- **Session Persistence:** The application retains the translator's clocked-in status even if they log out, switch browsers, or use a different device.
- **Shift Type Selection:** Options to label shifts as Standard, Sunday, Emergency, or Overnight.
- **Editable Entries:** Translators can edit their clock-in/out times, with all edits visibly labeled for transparency.
- **Administrative Adjustments:** Administrators can manually adjust hours when necessary.

### Payroll & Hour Tracking

- **Dynamic Pay Rates:** 
  - Standard Weekday: $35/hour
  - Sunday & Special Shifts: $50/hour
- **Time Rounding:** Hours are rounded up to the nearest 0.25 increment, with both raw and rounded times visible to administrators.
- **Transparency:** Total hours worked are accessible to both translators and administrators.
- **Overtime Notifications:** Translators receive alerts if they have been clocked in for 24 hours or more.

### Reporting & Data Export

- **Comprehensive Reports:** Administrators can generate reports sortable by concert or translator.
- **CSV Export:** Reports are exportable in CSV format for easy integration with other tools.
- **Payroll Summaries:** Detailed summaries displaying total hours worked and corresponding pay calculations.
- **Audit Trail:** All edits and adjustments are logged to maintain a clear history of changes.

### User Experience & Mobile Compatibility

- **Responsive Design:** Mobile-first design ensures optimal usability for translators on smartphones and tablets.
- **Administrator Dashboard:** Accessible on both desktop and mobile devices, providing flexibility in managing reports and user accounts.
- **Persistent State:** The application maintains the translator's clock-in status across sessions and devices.

## Technical Requirements

- **Frontend:**
  - **Framework:** Next.js for server-side rendering and optimized performance.
  - **Styling:** Tailwind CSS for efficient and responsive design.
  - **State Management:** React Context API or Zustand for managing application state.
  - **Authentication:** NextAuth.js to handle secure user authentication processes.

- **Backend:**
  - **API:** Next.js API Routes to manage serverless functions and backend logic.
  - **Database:** Supabase (PostgreSQL) for robust data storage and real-time capabilities.
  - **ORM:** Prisma for seamless and type-safe database interactions.

- **Hosting & Deployment:**
  - **Platform:** Vercel for hosting the application, ensuring seamless integration with Next.js.
  - **Database Hosting:** Supabase provides managed PostgreSQL hosting with built-in authentication.

- **Performance & Scalability:**
  - **Caching:** Utilize Vercel's edge functions to cache API responses for improved performance.
  - **Rate Limiting:** Implement middleware to prevent excessive API calls and ensure system stability.
  - **Background Jobs:** Schedule tasks using Vercel's Edge Config or an external scheduler for routine maintenance and notifications.

## Tech Stack

- **Frontend:**
  - [Next.js](https://nextjs.org/)
  - [Tailwind CSS](https://tailwindcss.com/)
  - [React Context API](https://reactjs.org/docs/context.html) or [Zustand](https://zustand-demo.pmnd.rs/)
  - [NextAuth.js](https://next-auth.js.org/)

- **Backend:**
  - [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
  - [Supabase](https://supabase.io/)
  - [Prisma](https://www.prisma.io/)

- **Hosting & Deployment:**
  - [Vercel](https://vercel.com/)
  - [Supabase](https://supabase.io/)

## File Structure

```
├── app/
│   ├── api/
│   │   ├── admin/
│   │   │   ├── reports/
│   │   │   │   └── download/
│   │   │   │       └── route.ts
│   │   │   └── time-entries/
│   │   │       └── route.ts
│   │   ├── auth/
│   │   │   ├── [...nextauth]/
│   │   │   │   └── route.ts
│   │   │   └── register/
│   │   │       └── route.ts
│   │   └── time-entries/
│   │       ├── [id]/
│   │       │   └── route.ts
│   │       ├── active/
│   │       │   └── route.ts
│   │       └── route.ts
│   ├── auth/
│   │   ├── error/
│   │   │   └── page.tsx
│   │   ├── signin/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── components/
│   │   ├── auth/
│   │   │   ├── sign-in-form.tsx
│   │   │   └── sign-up-form.tsx
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── select.tsx
│   │   │   ├── table.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── toaster.tsx
│   │   │   └── use-toast.ts
│   │   ├── admin-dashboard.tsx
│   │   ├── dashboard.tsx
│   │   ├── providers.tsx
│   │   ├── time-entries.tsx
│   │   └── time-tracker.tsx
│   ├── lib/
│   │   └── utils.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── auth.ts
│   ├── prisma.ts
│   └── utils.ts
├── prisma/
│   ├── migrations/
│   │   └── [timestamp]_init/
│   │       └── migration.sql
│   ├── schema.prisma
│   ├── seed.ts
│   └── tsconfig.json
├── types/
│   └── next-auth.d.ts
├── .env
├── .env.example
├── next.config.js
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## Key Directories and Files

### `/app` - Next.js App Router
- `/api` - API routes for backend functionality
  - `/admin` - Admin-specific endpoints
  - `/auth` - Authentication endpoints
    - `/[...nextauth]` - NextAuth.js API route handler
    - `/register` - User registration endpoint
  - `/time-entries` - Time entry management endpoints
- `/auth` - Authentication pages
  - `/error` - Error handling page
  - `/signin` - Sign-in page
  - `/signup` - Sign-up page
- `/components` - React components
  - `/auth` - Authentication-related components
  - `/ui` - Reusable UI components
  - Root-level components for main features

### `/lib` - Utility Functions and Configurations
- `auth.ts` - NextAuth.js configuration
- `prisma.ts` - Prisma client configuration
- `utils.ts` - Shared utility functions

### `/prisma` - Database Configuration
- `schema.prisma` - Database schema definition
- `migrations` - Database migration files
- `seed.ts` - Database seeding script
- `tsconfig.json` - TypeScript configuration for Prisma

### `/types` - TypeScript Type Definitions
- `next-auth.d.ts` - NextAuth.js type extensions

### Root Configuration Files
- `.env` - Environment variables
- `next.config.js` - Next.js configuration
- `package.json` - Project dependencies and scripts
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration

## Component Structure

### UI Components
- `button.tsx` - Reusable button component
- `card.tsx` - Card container component
- `input.tsx` - Form input component
- `label.tsx` - Form label component
- `select.tsx` - Dropdown select component
- `table.tsx` - Data table component
- `toast.tsx` - Toast notification component
- `toaster.tsx` - Toast notification manager
- `use-toast.ts` - Toast hook utility

### Feature Components
- `admin-dashboard.tsx` - Admin dashboard view
- `dashboard.tsx` - Main user dashboard
- `time-entries.tsx` - Time entries display
- `time-tracker.tsx` - Time tracking interface
- `providers.tsx` - Application providers wrapper

### Authentication Components
- `sign-in-form.tsx` - Sign-in form
- `sign-up-form.tsx` - Sign-up form

## Troubleshooting

### Authentication Issues

#### 404 Error During Login
If you encounter a 404 error when attempting to log in (regardless of correct credentials), this typically indicates a missing NextAuth.js API route configuration in the App Router format.

**Solution:**
1. Create the file `app/api/auth/[...nextauth]/route.ts`
2. Add the following configuration:
```typescript
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
```

This configuration is required because:
- Next.js 13+ with App Router requires specific API route handling
- NextAuth.js expects this route to handle all authentication requests
- The route creates necessary endpoints under `/api/auth/*` for:
  - Sign in/out
  - Session handling
  - Callbacks
  - JWT operations

### Database Connection Issues

#### Can't Reach Database Server Error
If you encounter an error like "Can't reach database server at 'aws-0-ap-southeast-2.pooler.supabase.com:6543'", this is likely due to an incorrect port number in the DATABASE_URL.

**Solution:**
When deploying to Vercel, ensure your `DATABASE_URL` environment variable uses port `6543` (not `5432`) for Supabase connection:

```bash
# Correct format for Supabase Pooler connection
DATABASE_URL="postgresql://[user]:[password]@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres"
```

Note: While `DIRECT_URL` should remain on port `5432`, the `DATABASE_URL` must use port `6543` for Supabase's connection pooler to work properly in production.

[Rest of the README remains unchanged...]

