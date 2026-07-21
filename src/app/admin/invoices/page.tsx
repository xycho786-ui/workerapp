import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminInvoicesClient from "./AdminInvoicesClient";

export const metadata = {
  title: "Admin Invoices — ServiceHub",
  description: "View and manage all platform invoices.",
};

export default async function AdminInvoicesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!dbUser || dbUser.role !== "ADMIN") {
    redirect("/login");
  }

  const invoices = await prisma.invoice.findMany({
    select: {
      id: true,
      invoiceNumber: true,
      date: true,
      totalAmount: true,
      emailStatus: true,
      emailSentAt: true,
      createdAt: true,
      payment: {
        select: {
          id: true,
          amount: true,
          platformFee: true,
          method: true,
          transactionId: true,
          status: true,
          customer: {
            select: {
              name: true,
              email: true,
            },
          },
          booking: {
            select: {
              id: true,
              jobDetails: true,
              price: true,
              worker: {
                select: {
                  profession: true,
                  user: { select: { name: true, email: true } },
                },
              },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Serialize dates for client components
  const serialized = invoices.map((inv) => ({
    ...inv,
    date: inv.date.toISOString(),
    emailSentAt: inv.emailSentAt?.toISOString() ?? null,
    createdAt: inv.createdAt.toISOString(),
  }));

  return (
    <AdminInvoicesClient
      invoices={serialized as any}
      userName={dbUser.name}
      userEmail={dbUser.email}
    />
  );
}
