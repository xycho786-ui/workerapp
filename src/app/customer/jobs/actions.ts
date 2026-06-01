"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function cancelServiceRequest(requestId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
      throw new Error("Unauthorized");
    }

    await prisma.serviceRequest.update({
      where: { id: requestId },
      data: { status: "CLOSED" },
    });

    revalidatePath("/customer/jobs");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to cancel request:", error);
    return { success: false, error: error.message };
  }
}

export async function cancelBooking(bookingId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
      throw new Error("Unauthorized");
    }

    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED" },
    });

    revalidatePath("/customer/jobs");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to cancel booking:", error);
    return { success: false, error: error.message };
  }
}

export async function createReview({
  workerId,
  rating,
  comment,
}: {
  workerId: string;
  rating: number;
  comment: string;
}) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
      throw new Error("Unauthorized");
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!dbUser) {
      throw new Error("User not found");
    }

    // Create review
    await prisma.review.create({
      data: {
        rating,
        comment,
        reviewerId: dbUser.id,
        workerId,
      },
    });

    // Update worker average rating and count
    const reviews = await prisma.review.findMany({
      where: { workerId },
    });

    const totalReviews = reviews.length;
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

    await prisma.workerProfile.update({
      where: { id: workerId },
      data: {
        rating: parseFloat(avgRating.toFixed(1)),
        totalReviews,
      },
    });

    revalidatePath("/customer/jobs");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to submit review:", error);
    return { success: false, error: error.message };
  }
}
