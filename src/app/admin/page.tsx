import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { getCmsData } from "@/lib/cms";
import { AdminStudio } from "@/components/admin/AdminStudio";

export default async function AdminPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  const data = await getCmsData();
  return <AdminStudio initialData={data} userEmail={session.email} />;
}
