import { Link as RadixLink } from "@radix-ui/themes"
import NextLink, { LinkProps as NextLinkProps } from "next/link"
import React, { ForwardRefRenderFunction } from "react"

type LinkProps = NextLinkProps & React.AnchorHTMLAttributes<HTMLAnchorElement>

const Link: ForwardRefRenderFunction<HTMLAnchorElement, LinkProps> = (props, ref) => (
  <RadixLink asChild>
    <NextLink {...props} ref={ref}>
      {props.children}
    </NextLink>
  </RadixLink>
)

export default React.forwardRef(Link)
