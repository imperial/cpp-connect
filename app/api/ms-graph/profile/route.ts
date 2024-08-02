import { auth } from "@/auth"
import prisma from "@/lib/db"

export const GET = async () => {
  const session = await auth()

  if (!session) {
    return new Response("Not authenticated", { status: 401 })
  }

  if (!session.user.id) {
    return new Response("User ID not found", { status: 401 })
  }

  // Get token
  const user = await prisma.user.findFirst({
    relationLoadStrategy: "join",
    select: {
      accounts: {
        where: {
          provider: "microsoft-entra-id",
        },
        orderBy: {
          updatedAt: "desc",
        },
      },
      id: true,
    },
    where: {
      id: session.user.id,
    },
  })

  if (!user) {
    return new Response("User not found", { status: 401 })
  } else if (!user.accounts.length) {
    return new Response("No accounts found", { status: 401 })
  }

  const access_token = user.accounts[0].access_token

  const response = await fetch(`https://graph.microsoft.com/v1.0/me/photos/240x240/$value`, {
    headers: { Authorization: `Bearer ${access_token}` },
  })

  // Confirm that profile photo was returned
  // TODO: Do this without Buffer
  if (response.ok && typeof Buffer !== "undefined") {
    try {
      const pictureBuffer = await response.arrayBuffer()
      const pictureBase64 = Buffer.from(pictureBuffer)

      return new Response(pictureBase64, {
        headers: {
          "Content-Type": "image/jpeg",
          "Content-Length": pictureBase64.length.toString(10),
        },
        status: 200,
      })
    } catch {
      return new Response("Error processing image", { status: 500 })
    }
  } else {
    return new Response("No image found", { status: 404 })
  }
}
