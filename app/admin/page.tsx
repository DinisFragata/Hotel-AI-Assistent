import type { Metadata } from "next"
import AdminDashboard from "@/components/admin/AdminDashboard"

export const metadata: Metadata = {
  title: "Dashboard — Hotel",
}

export default function AdminPage() {
  return <AdminDashboard />
}
