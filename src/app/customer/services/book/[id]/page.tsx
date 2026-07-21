import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import BookingFormClient from "./BookingFormClient";

export default async function BookWorkerPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const worker = await prisma.workerProfile.findUnique({
    where: { id: params.id },
    include: {
      user: true
    }
  });

  if (!worker) {
    notFound();
  }

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen text-xs font-semibold text-slate-500">
        Loading booking details...
      </div>
    }>
      <BookingFormClient 
        workerId={worker.id} 
        workerName={worker.user.name} 
        profession={worker.profession[0] || "Worker"} 
        hourlyRate={worker.hourlyRate || 0} 
      />
    </Suspense>
  );
}
