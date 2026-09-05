import { redirect } from "next/navigation";

export default function AdminPage() {
  redirect("/login?next=%2Fdashboard");
}
