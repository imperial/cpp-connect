import { Link as RadixLink } from "@radix-ui/themes"
import NextLink, { LinkProps as NextLinkProps } from "next/link"
import React, { ForwardRefRenderFunction } from "react"

type RadixLinkProps = React.ComponentProps<typeof RadixLink>

type LinkProps = NextLinkProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> &
  RadixLinkProps & {
    radixProps?: RadixLinkProps
  }

/**
 * A wrapper around Next.js' Link component that adds Radix styling.
 * @param radixProps The props for the Radix styling of the link.
 * @param props The props for the Next.js Link component.
 * @param ref The ref for the anchor element.
 * @example
 *   <Link href="/about" radixProps={{ underline: "hover" }}>About</Link>
 *   The href prop goes to the Next.js Link component, and the radixProps prop goes to the Radix Link component.
 */
const Link: ForwardRefRenderFunction<HTMLAnchorElement, LinkProps> = ({ radixProps, ...props }, ref) => (
  <RadixLink asChild {...radixProps}>
    <NextLink {...props} ref={ref}>
      {props.children}
    </NextLink>
  </RadixLink>
)

export default React.forwardRef(Link)
