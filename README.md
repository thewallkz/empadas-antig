# Empadas Antigravity - Ordering System

Empadas Antigravity is a modern, mobile-first ordering system built to manage savory snacks sales. It features a complete client-facing storefront for users to browse and order products, alongside a secure admin dashboard for managing products and active orders.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Database ORM**: [Prisma](https://www.prisma.io/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Authentication**: NextAuth / Custom DB Authentication
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)

## Features

- **Client Storefront**: A premium, responsive UI for customers to explore the menu, add items to the cart, and place orders.
- **Admin Dashboard**: Secure area to create, edit, publish, unpublish, and delete menu items while tracking order statuses.
- **Order Workflow**: End-to-end flow from product selection by the client to order confirmation and management by the admin.
- **Persistent Image Storage**: Uses Supabase Storage in production, with local fallback only for development.

## Getting Started

### Prerequisites

- Node.js `20.19+`
- A Supabase project (for PostgreSQL connection)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   Create a `.env` file in the root directory based on `.env.example`:
   ```env
   DATABASE_URL="your_transaction_connection_string"
   DIRECT_URL="your_session_connection_string"
   AUTH_SECRET="your_32_byte_secret"
   SUPABASE_URL="https://your-project.supabase.co"
   SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"
   SUPABASE_STORAGE_BUCKET="product-images"
   ```

   Notes:
   - `DATABASE_URL` should use the Supabase pooler connection for runtime queries.
   - `DIRECT_URL` should use the direct connection for Prisma CLI workflows. In Prisma 7 this is configured in `prisma.config.ts`, not in `schema.prisma`.
   - `AUTH_SECRET` is required by NextAuth v5 in production.
   - `SUPABASE_SERVICE_ROLE_KEY` must stay server-side only.

3. Generate Prisma client and sync database structure:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the client app.

## Deploying

This project is configured for deployment on [Vercel](https://vercel.com/). Before deploying, make sure you configure the same environment variables from `.env.example` in Vercel.

Recommended production setup:
- `DATABASE_URL`: Supabase pooler connection string
- `DIRECT_URL`: direct PostgreSQL connection string for Prisma CLI
- `AUTH_SECRET`: random secret with at least 32 bytes
- `SUPABASE_URL`: your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: server-side key for image uploads
- `SUPABASE_STORAGE_BUCKET`: public bucket used for product images

Important notes:
- `proxy.ts` is the correct route-protection convention for Next.js 16.
- Product images should not be stored on the Vercel filesystem in production.
- Prisma 7 reads connection URLs from `prisma.config.ts`, so `schema.prisma` should keep only the datasource provider.
