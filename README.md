# Courant Timesheet

A time tracking application for translators.

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   ├── concerts/
│   │   │   ├── [concertId]/
│   │   │   │   └── route.ts
│   │   │   └── route.ts
│   │   └── time-entries/
│   │       ├── active/
│   │       │   └── route.ts
│   │       └── route.ts
│   ├── auth/
│   │   └── signin/
│   │       └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── avatar.tsx
│   │   │   ├── button.tsx
│   │   │   ├── calendar.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── error-boundary.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── popover.tsx
│   │   │   ├── select.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── toast.tsx
│   │   │   └── use-toast.ts
│   │   ├── admin-dashboard.tsx
│   │   ├── auth-form.tsx
│   │   ├── concert-list.tsx
│   │   ├── concert-management.tsx
│   │   ├── concert-selector.tsx
│   │   ├── dashboard.tsx
│   │   ├── time-entries.tsx
│   │   ├── time-tracker.tsx
│   │   ├── translator-dashboard.tsx
│   │   └── user-nav.tsx
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── auth.ts
│   ├── concerts.ts
│   ├── prisma.ts
│   ├── utils.ts
│   └── validations/
│       └── time-entry.ts
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
├── scripts/
│   ├── __tests__/
│   │   ├── helpers/
│   │   │   ├── e2e-setup.ts
│   │   │   ├── global-setup.ts
│   │   │   ├── global-teardown.ts
│   │   │   └── test-utils.ts
│   │   ├── concert-management.test.ts
│   │   ├── create-admin.test.ts
│   │   └── e2e/
│   │       └── auth.e2e.ts
│   ├── create-admin.ts
│   ├── deploy.sh
│   └── test-deployment.sh
├── .env
├── .env.test
├── .gitignore
├── jest.config.e2e.js
├── jest.config.js
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── tsconfig.json
```

## Features

- Authentication with NextAuth.js
- Role-based access control (Admin/Translator)
- Concert management for admins
- Time tracking for translators
- Real-time updates
- Error handling and reporting
- Responsive design

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Prisma ORM
- PostgreSQL
- TailwindCSS
- Shadcn UI
- React Query
- Jest for testing

