import styles from "./mobileNavbar.module.scss"

import Link from "../Link"
import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import { Flex, IconButton } from "@radix-ui/themes"
import Image from "next/image"
import React from "react"
import { BsList } from "react-icons/bs"

const MobileNavbar = () => {
  return (
    <NavigationMenu.Root orientation="vertical">
      <NavigationMenu.List className={styles.NavigationMenuList}>
        <NavigationMenu.Item className={styles.NavigationMenuItem}>
          <IconButton size="4" asChild>
            <NavigationMenu.Trigger>
              <BsList size="2em" />
            </NavigationMenu.Trigger>
          </IconButton>
          <Image src="/images/cpp-connect-logo.svg" alt="cpp connect logo" width={0} height={0} />
          <Image src="/images/imperial-logo.svg" alt="imperial logo" width={0} height={0} />

          <NavigationMenu.Content className={styles.NavigationMenuContent}>
            <NavigationMenu.Link asChild>
              <Link href="/companies" className={styles.link}>
                <span>Companies</span>
              </Link>
            </NavigationMenu.Link>
            <NavigationMenu.Link asChild>
              <Link href="/events" className={styles.link}>
                <span>Events</span>
              </Link>
            </NavigationMenu.Link>
            <NavigationMenu.Link asChild>
              <Link href="/opportunities" className={styles.link}>
                <span>Opportunities</span>
              </Link>
            </NavigationMenu.Link>
            <NavigationMenu.Link asChild>
              <Link href="/students" className={styles.link}>
                <span>Students</span>
              </Link>
            </NavigationMenu.Link>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>
      <NavigationMenu.Viewport className={styles.NavigationMenuViewport} />
    </NavigationMenu.Root>
  )
}

export default MobileNavbar
