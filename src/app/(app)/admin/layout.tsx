import { requireAdmin } from "@/lib/auth";

/** Every /admin route is admin-only; pages also re-check inside their actions. */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return <>{children}</>;
}
