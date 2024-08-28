import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components"
import * as React from "react"

/**
 * radixTheme[9] is the Imperial Blue
 */
const radixTheme = [
  "#ffffff",
  "#fcfdff",
  "#f6faff",
  "#eaf2ff",
  "#ddeaff",
  "#ccdfff",
  "#b5d2ff",
  "#99bfff",
  "#75a4ff",
  "#0000cd",
  "#002ee3",
  "#1a51ea",
  "#112b6b",
]

type CSS = React.CSSProperties

export default function SignInEmail({
  company,
  signInURL,
  emailMode,
}: {
  company: string | undefined
  signInURL: string
  emailMode: boolean
}) {
  const logoURL = emailMode ? "cid:cpp-connect.png" : "/static/images/cpp-connect-logo.png"
  const imperialLogoURL = emailMode ? "cid:imperial.png" : "/static/images/imperial-logo.png"

  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Sign in to CPP Connect</title>
      </Head>
      <Preview>Sign in to CPP Connect</Preview>
      <Body style={main}>
        <Container style={mainBodyContainer}>
          <Section>
            <Row style={logoBanner}>
              <Column style={left}>
                <Img
                  style={{ ...logoBannerImg, height: "3.5rem", paddingRight: "20px" }}
                  src={logoURL}
                  alt="cpp connect logo"
                  height={50}
                />
              </Column>
              <Column style={right}>
                <Img style={{ ...logoBannerImg, paddingLeft: "20px" }} src={imperialLogoURL} alt="imperial logo" />
              </Column>
            </Row>
          </Section>
          <Container style={textBodyContainer}>
            <Section>
              <Heading as="h1" style={heading}>
                Hi {company ? company : "there"},
              </Heading>
              <Text style={text}>Click the link below to sign into CPP Connect:</Text>
            </Section>
            <Section style={centre}>
              <Button style={{ ...button, margin: "0.75rem 0" }} href={signInURL}>
                <Text style={buttonText}>Sign In</Text>
              </Button>
            </Section>
            <Section>
              <Text style={text}>If you did not send this email you can safely ignore it.</Text>
            </Section>

            <Hr style={hr} />

            <Section>
              <Text style={footerText}>
                Magic link sent by Imperial’s CPP Connect{company ? ` to ${company}` : ""}.<br />
                CPP Connect will never ask you for a password or your personal information.
              </Text>
              <Text style={footerText}>
                Imperial College London
                <br />
                Exhibition Road
                <br />
                London
                <br />
                SW7 2AZ
              </Text>
            </Section>
          </Container>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: radixTheme[7],
  width: "100%",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
} satisfies CSS

const mainBodyContainer = { background: "#ffffff" } satisfies CSS
const textBodyContainer = { padding: "1.875rem" } satisfies CSS

const logoBanner = {
  backgroundColor: radixTheme[9],
  width: "100%",
  padding: "1.875rem",
} satisfies CSS

const logoBannerImg = { display: "inline" } satisfies CSS

const heading = {
  marginTop: "0",
} satisfies CSS

const text = {
  fontSize: "1rem",
} satisfies CSS

const button = {
  width: "170px",
  textAlign: "center",
  verticalAlign: "middle",
  height: "50px",
  backgroundColor: radixTheme[9],
  textDecoration: "none",
  color: radixTheme[0],
  borderRadius: "6px",
} satisfies CSS

const buttonText = {
  ...text,
  marginTop: "12px",
  marginBottom: "12px",
} satisfies CSS

const centre = {
  textAlign: "center",
} satisfies CSS

const right = {
  textAlign: "right",
} satisfies CSS

const left = {
  textAlign: "left",
} satisfies CSS

const hr = {
  borderTop: "1px solid #C2C2C2",
} satisfies CSS

const footerText = {
  color: "#606060",
  fontSize: "0.875rem",
  lineHeight: 1.4,
} satisfies CSS
