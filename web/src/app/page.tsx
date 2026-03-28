import NavBar from "@/components/NavBar";
import UserDashBoard from "@/components/UserDashBoard";
import Image from "next/image";
import { auth } from "@/auth";
import { redirect } from "next/navigation";


export default async function Home() {

  const session = await auth();
  if (
    session?.user?.role === "admin" ||
    session?.user?.role === "dummy_admin"
  ) {
    redirect("/admin");
  }
  return (
   <>

   <UserDashBoard/>
 </>
  );
}
