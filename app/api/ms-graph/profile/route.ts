import { auth } from "@/auth"
import { getEntraAccessToken } from "@/lib/tokens"

export const GET = async () => {
  const session = await auth()

  if (!session) {
    return new Response("Not authenticated", { status: 401 })
  }

  if (!session.user.id) {
    return new Response("User ID not found", { status: 401 })
  }

  let access_token: string
  try {
    access_token = await getEntraAccessToken(session.user.id)
    if (!access_token) {
      return new Response("Not authenticated", { status: 401 })
    }
  } catch (e) {
    return new Response("Error fetching access token", { status: 500 })
  }

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
