"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function acceptJobRequest(requestId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
      throw new Error("Unauthorized");
    }

    // Find the worker profile
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      include: { workerProfile: true }
    });

    if (!dbUser || !dbUser.workerProfile) {
      throw new Error("Worker profile not found");
    }

    // Find the service request
    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { id: requestId },
      include: { customer: true }
    });

    if (!serviceRequest) {
      throw new Error("Service request not found");
    }

    if (serviceRequest.status !== 'OPEN') {
      throw new Error("This request is no longer open");
    }

    // Accept in a transaction
    const [booking, updatedRequest] = await prisma.$transaction([
      prisma.booking.create({
        data: {
          customerId: serviceRequest.customerId,
          workerId: dbUser.workerProfile.id,
          jobDetails: `${serviceRequest.category}: ${serviceRequest.description}`,
          price: serviceRequest.budget,
          status: 'ACCEPTED'
        }
      }),
      prisma.serviceRequest.update({
        where: { id: requestId },
        data: { status: 'MATCHED' }
      })
    ]);

    // Create or find a conversation and add welcome message
    try {
      const conversation = await prisma.conversation.upsert({
        where: {
          customerId_workerId: {
            customerId: serviceRequest.customerId,
            workerId: dbUser.workerProfile.id,
          }
        },
        update: {},
        create: {
          customerId: serviceRequest.customerId,
          workerId: dbUser.workerProfile.id,
        }
      });

      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          senderId: dbUser.id,
          content: `Hi! I have accepted your request for "${serviceRequest.category}": "${serviceRequest.description}". I am on my way to help you!`,
        }
      });
    } catch (chatError) {
      console.error("Failed to initialize conversation message:", chatError);
    }

    revalidatePath("/worker/dashboard");
    revalidatePath("/worker/jobs");
    return { success: true, booking };
  } catch (error: any) {
    console.error("Failed to accept job:", error);
    return { success: false, error: error.message };
  }
}

export async function verifyOtpCode(bookingId: string, enteredOtp: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
      throw new Error("Unauthorized");
    }

    // Deterministic OTP calculator based on booking ID
    const num = bookingId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const correctOtp = Math.abs(Math.sin(num) * 1000000).toFixed(0).padEnd(6, "0").substring(0, 6);

    if (enteredOtp !== correctOtp) {
      throw new Error("Invalid verification code. Please check with the customer.");
    }

    // Update status to IN_PROGRESS
    await prisma.booking.update({
      where: { id: bookingId },
      data: { 
        status: "IN_PROGRESS",
        updatedAt: new Date()
      },
    });

    revalidatePath("/worker/dashboard");
    revalidatePath("/worker/jobs");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to verify OTP:", error);
    return { success: false, error: error.message };
  }
}

export async function completeBooking(bookingId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
      throw new Error("Unauthorized");
    }

    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "COMPLETED" },
    });

    revalidatePath("/worker/dashboard");
    revalidatePath("/worker/jobs");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to complete booking:", error);
    return { success: false, error: error.message };
  }
}
