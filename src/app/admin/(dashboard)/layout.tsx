import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminSidebarNav } from "@/components/admin/sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { signOutAction } from "./actions";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="hidden w-64 shrink-0 border-r bg-background lg:block">
        <div className="sticky top-0 h-screen">
          <AdminSidebarNav />
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <AdminHeader user={session.user} onSignOut={signOutAction} />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
