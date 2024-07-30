import NextAuth, { NextAuthConfig } from "next-auth"
import AzureAd from "next-auth/providers/azure-ad"

export const config: NextAuthConfig = {
    providers: [
        AzureAd({
            clientId: process.env.AZURE_AD_CLIENT_ID,
            clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
            tenantId: process.env.AZURE_AD_TENANT_ID,
        }),
    ],
    callbacks: {
        authorized: async ({ auth }) => {
            // Logged in users are authenticated, otherwise redirect to login page
            return !!auth
        },
    },

    // TODO: uncomment when we have a login page
    // pages: {
    //   signIn: "/login"
    // },
}

export const { handlers, auth, signIn, signOut } = NextAuth(config)