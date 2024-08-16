import prisma from "@/lib/db"

import SignInEmail from "./Signin"

import { render } from "@react-email/render"
import { convert } from "html-to-text"
import { NodemailerConfig } from "next-auth/providers/nodemailer"
import { createTransport } from "nodemailer"
import { join } from "path"

export const sendVerificationRequest: NodemailerConfig["sendVerificationRequest"] = async params => {
  const { identifier, url, provider } = params

  const htmlToSend = await html(url, identifier)
  const textToSend = convert(htmlToSend)

  const transport = createTransport(provider.server)
  const result = await transport.sendMail({
    to: identifier,
    from: provider.from,
    subject: `Sign in to CPP Connect`,
    text: textToSend,
    html: htmlToSend,

    // attach images
    attachments: [
      {
        filename: "cpp-connect-logo.png",
        path: join(process.cwd(), "emails/static/images/cpp-connect-logo.png"),
        cid: "cpp-connect.png", //same cid value as in the html img src
      },
      {
        filename: "imperial-logo.png",
        path: join(process.cwd(), "emails/static/images/imperial-logo.png"),
        cid: "imperial.png", //same cid value as in the html img src
      },
    ],
  })
  const failed = result.rejected.concat(result.pending).filter(Boolean)
  if (failed.length) {
    throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`)
  }
}

async function html(url: string, email: string) {
  // Do DB lookup
  const company = await prisma.user.findUnique({
    where: { email },
    select: {
      associatedCompany: {
        select: { name: true },
      },
    },
  })

  const companyName = company?.associatedCompany?.name

  return render(<SignInEmail emailMode company={companyName} signInURL={url} />)
}
