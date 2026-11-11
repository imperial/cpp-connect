const NEW_SITE = "https://cpp-connect.doc.ic.ac.uk/"

export const config = {
  matcher: "/:path*",
}

export const middleware = () =>
  new Response(
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>CPP Connect has moved</title>
  </head>
  <body style="font-family: system-ui, sans-serif; text-align: center; padding: 4rem 1rem">
    <h1>Moved to: <a href="${NEW_SITE}">${NEW_SITE}</a></h1>
  </body>
</html>`,
    { headers: { "content-type": "text/html; charset=utf-8" } },
  )
