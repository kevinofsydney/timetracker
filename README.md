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
- **Session Persistence:** The application retains the translator’s clocked-in status even if they log out, switch browsers, or use a different device.
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
- **Persistent State:** The application maintains the translator’s clock-in status across sessions and devices.

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
  - **Caching:** Utilize Vercel’s edge functions to cache API responses for improved performance.
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

