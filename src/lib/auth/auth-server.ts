import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../../database/index";
import { after } from "next/server";
import { sendAccountVerificationEmail } from "../email/emails";

export const authServer = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 60 * 30,
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
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  user: {
    additionalFields: {
      cpf: {
        type: "string",
        required: false,
      },
      agreeToTerms: {
        type: "boolean",
        required: false,
      },
    },
  },
});
