import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ServicesClient from "./ServicesClient";

export default async function ServicesPage(props: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) {
    redirect("/login");
  }

  const searchParams = await props.searchParams;
  const initialCategory = searchParams.category || "All";
  const initialSearch = searchParams.search || "";

  // Fetch all workers with userType = 'worker'
  const workers = await prisma.workerProfile.findMany({
    where: {
      userType: "worker"
    },
    include: {
      user: true,
      category: true,
      location: true,
    },
    orderBy: { rating: 'desc' },
  });

  return (
    <div className="flex flex-col h-full bg-[#F5F5F7]">
      <ServicesClient 
        initialWorkers={workers} 
        selectedCategory={initialCategory} 
        searchQuery={initialSearch} 
      />
    </div>
  );
}
