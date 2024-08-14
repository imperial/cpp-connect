import { redirect } from "next/navigation"

const Page = async () => {
  return redirect("/auth/login")
}

export default Page
