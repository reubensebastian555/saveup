import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto flex max-w-6xl gap-6 p-4">
        <Sidebar />
        <main className="flex-1 space-y-4">{children}</main>
      </div>
    </div>
  );
}
