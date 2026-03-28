import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { getPrisma } from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const prisma = getPrisma();
        
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
      const isOnAdminApi = nextUrl.pathname.startsWith('/api/admin');
      
      if (nextUrl.pathname === '/admin/login') {
        if (isLoggedIn) {
          return Response.redirect(new URL('/admin/orders', nextUrl));
        }

        return true;
      }

      if (isOnAdminApi) {
        if (isLoggedIn) {
          return true;
        }

        return Response.json({ error: "Unauthorized" }, { status: 401 });
      }

      if (isOnAdmin) {
        return isLoggedIn;
      }

      return true;
    },
  },
  session: { strategy: "jwt" },
});
