export const SLUG_START = "https://" + window.location.host + "/companies/"
export const slugComputer = (companyName: string) => companyName.toLowerCase().replace(/\s/g, "-")
