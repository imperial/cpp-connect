import styles from "./mobileNavbar.module.scss"

import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import React from "react"

const MobileNavbar = () => {
  return (
    <NavigationMenu.Root orientation="vertical">
      <NavigationMenu.List>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger>Click me</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <p>Hello</p>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>
      <NavigationMenu.Viewport className={styles.NavigationMenuViewPort} />
    </NavigationMenu.Root>
  )
}

export default MobileNavbar
