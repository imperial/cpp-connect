import Link from "./Link"
import styles from "./footer.module.scss"
import { FOOTER_ID } from "./util/constants"

import { Flex, Text } from "@radix-ui/themes"
import React from "react"

const Footer = () => {
  return (
    <Flex className={styles.container} justify="center" p="3" id={FOOTER_ID}>
      <Text>
        © 2024. Found a bug or want to improve CPP Connect yourself? Head over to{" "}
        <Link
          href="https://github.com/imperial/cpp-connect"
          target="_blank"
          className={styles.githubLink}
          radixProps={{ underline: "always" }}
        >
          GitHub
        </Link>{" "}
        and join the team who made this site possible.
      </Text>
    </Flex>
  )
}

export default Footer
