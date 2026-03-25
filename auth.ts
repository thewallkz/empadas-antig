import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        // Find admin in the database
        const admin = await prisma.admin.findUnique({
          where: { email: credentials.email as string },
        });

        if (!admin) {
          return null; // Admin not found
        }

        // Compare password safely
        const isValidPassword = await bcrypt.compare(
          credentials.password as string,
          admin.password
        );

        if (isValidPassword) {
          return { id: admin.id, name: admin.name || "Administrador", email: admin.email };
        }
        
        return null; // Invalid password
      }
    })
  ],
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');
      
      if (isOnAdmin) {
        // If logged in and trying to access login page, redirect to Dashboard
        if (nextUrl.pathname === '/admin/login') {
          if (isLoggedIn) return Response.redirect(new URL('/admin/orders', nextUrl));
          return true; // allow non-logged users to see login page
        }
        // General protection for /admin/*
        if (isLoggedIn) return true;
        
        // Redirect to login
        return false;
      }
      return true; // Allow API and public routes
    },
  },
  session: { strategy: "jwt" },
});
