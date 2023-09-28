import { Navbar } from "@/features/_core/navbar";
import { Sidebar } from "@/features/_core/sidebar";

export default function DashboardLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      <div className="container flex gap-4">
        <Sidebar />
        <main className="grow">{children}</main>
      </div>
    </div>
  );
}
