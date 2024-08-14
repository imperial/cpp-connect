/**
 * Given an email address (unencoded), return a URL-encoded string of the format http://{hostname}/auth/login/partner?token={base64-then-url-encoded-email}
 *
 * This allows us to pass the email to the frontend to fill in the email field of the sign-in form in.
 */
export const encodeSignInUrl = (email: string, baseUrl: string): string =>
  new URL(`/auth/login/partner?token=${encodeURIComponent(btoa(email))}`, baseUrl).toString()

/**
 * Given a sign-in token extracted from the URL that was created with {@link encodeSignInUrl}, decode it and return the email address inside.
 */
export const decodeSignInToken = (token: string): string => atob(decodeURIComponent(token))
