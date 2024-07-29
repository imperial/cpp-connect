import NextAuth from "next-auth"
import AzureAd from "next-auth/providers/azure-ad"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    AzureAd({
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      tenantId: process.env.AZURE_AD_TENANT_ID,
    }),
  ],
})
