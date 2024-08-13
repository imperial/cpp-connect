import Logo from "./images/cpp-connect-logo.png"

import { Button, Column, Container, Head, Heading, Html, Img, Preview, Row, Section } from "@react-email/components"
import * as React from "react"

export const ICL_BLUE = "#0000cd"

export default function Email() {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Sign In to CPP Connect</title>
      </Head>
      <Preview>Email preview text</Preview>
      <Container>
        {/*  */}
        <Section>
          <Row
            style={{
              backgroundColor: ICL_BLUE,
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
        <Button href="https://example.com" style={{ color: "#61dafb" }}>
          Click me
        </Button>
      </Container>
    </Html>
  )
}
