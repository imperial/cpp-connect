/** NOTE: DO NOT USE IN SERVER COMPONENT AS WILL NOT RENDER PROPERLY ON SERVER */
export const SLUG_START =
  "https://" + (typeof window !== "undefined" ? window?.location?.host : "cpp-connect") + "/companies/"
export const slugComputer = (companyName: string) => companyName.toLowerCase().replace(/\s/g, "-")
