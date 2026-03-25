# Empadas Antigravity - Ordering System

Empadas Antigravity is a modern, mobile-first ordering system built to manage savory snacks sales. It features a complete client-facing storefront for users to browse and order products, alongside a secure admin dashboard for managing products, categories, and active orders.

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
- **Admin Dashboard**: Secure area to manage menu items (create, update, delete), organize them into categories, and track order statuses.
- **Order Workflow**: End-to-end flow from product selection by the client to order confirmation and management by the admin.
- **Local Image Storage**: Built-in handling of product images locally during development.

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- A Supabase project (for PostgreSQL connection)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   Create a `.env` file in the root directory and add your connection variables:
   ```env
   DATABASE_URL="your_transaction_connection_string"
   DIRECT_URL="your_session_connection_string"
   ```

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

This project is configured for deployment on [Vercel](https://vercel.com/). Ensure that your environment variables (like `DATABASE_URL` and `DIRECT_URL`) are properly configured in Vercel before triggering a deployment.
