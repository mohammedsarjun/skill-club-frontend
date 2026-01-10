// app/home/page.js
import { redirect } from "next/navigation";

export default function HomeRedirect() {
  redirect("/"); // automatically redirects to root
}
