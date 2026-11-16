import "server-only";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/database";
import { after } from "next/server";
import { sendAccountVerificationEmail } from "@/lib/email/emails";
import { ENV } from "@/utils/env/env.server";

export const authServer = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  secret: ENV.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 1, //! Change to 60 * 30
    sendVerificationEmail: async ({ user, url }) => {
      after(
        async () =>
          await sendAccountVerificationEmail({
            userName: user.name,
            to: user.email,
            verificationUrl: url,
          }),
      );
    },
  },
  plugins: [nextCookies()],
  socialProviders: {
    google: {
      clientId: ENV.GOOGLE_CLIENT_ID!,
      clientSecret: ENV.GOOGLE_CLIENT_SECRET!,
    },
  },
});
