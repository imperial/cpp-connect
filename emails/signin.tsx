import Logo from "./images/cpp-connect-logo.png"

import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components"
import * as React from "react"

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
// raixTheme[8] is ICL_BLUE

export default function Email() {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Sign In to CPP Connect</title>
      </Head>
      <Preview>Email preview text</Preview>
      <Body style={main}>
        <Container style={{ background: "#ffffff" }}>
          {/*  */}
          <Section>
            <Row
              style={{
                backgroundColor: radixTheme[9],
                width: "100%",
                padding: "1.875rem",
              }}
            >
              <Column style={{ textAlign: "left" }}>
                <Img
                  style={{ display: "inline", height: "3.5rem" }}
                  src="/static/images/cpp-connect-logo.png"
                  alt="cpp connect logo"
                  height={50}
                />
              </Column>
              <Column style={{ textAlign: "right" }}>
                <Img style={{ display: "inline" }} src="/static/images/imperial-logo.png" alt="imperial logo" />
              </Column>
            </Row>
          </Section>
          <Container style={{ padding: "1.875rem" }}>
            <Section>
              <Heading as="h1" style={heading}>
                Hi Imperial,
              </Heading>
              <Text style={text}>Click the link below to sign into CPP Connect:</Text>
            </Section>
            <Section>
              <Button style={button} href="https://example.com">
                Sign in
              </Button>
            </Section>
            <Section>
              <Text style={text}>If you did not send this email you can safely ignore it.</Text>
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
  height: "100%",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const heading = {
  marginTop: "0",
}

const text = {
  fontSize: "1rem",
}

const button = {
  width: "170px",
  textAlign: "center",
  verticalAlign: "middle",
  height: "50px",
  backgroundColor: radixTheme[9],
  textDecoration: "none",
  color: radixTheme[0],
}
