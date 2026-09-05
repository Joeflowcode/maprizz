import { redirect } from "next/navigation";

export default function DashboardPage() {
  redirect("/login?next=%2Fdashboard");
}
