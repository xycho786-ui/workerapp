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

    // Retrieve booking with worker details for notification
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        worker: true
      }
    });

    if (!booking) {
      throw new Error("Booking not found");
    }

    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED" },
    });

    // Create worker notification
    try {
      await prisma.notification.create({
        data: {
          userId: booking.worker.userId,
          title: "❌ Booking Cancelled",
          message: "The customer cancelled the booking.",
          category: "BOOKINGS",
          relatedId: booking.id,
          type: "WARNING"
        }
      });
    } catch (err) {
      console.error("Failed to create worker cancellation notification:", err);
    }

    revalidatePath("/customer/jobs");
    revalidatePath("/worker/dashboard");
    revalidatePath("/worker/jobs");
    revalidatePath("/customer/notifications");
    revalidatePath("/worker/notifications");
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

    // Retrieve worker details for notification
    const workerProfile = await prisma.workerProfile.findUnique({
      where: { id: workerId },
      include: { user: true }
    });

    if (!workerProfile) {
      throw new Error("Worker profile not found");
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

    // Create worker notification
    try {
      await prisma.notification.create({
        data: {
          userId: workerProfile.userId,
          title: "⭐ New Review",
          message: `You received a ${rating}-star review.`,
          category: "REVIEWS",
          relatedId: workerId,
          type: "SUCCESS"
        }
      });
    } catch (err) {
      console.error("Failed to create worker review notification:", err);
    }

    revalidatePath("/customer/jobs");
    revalidatePath("/worker/dashboard");
    revalidatePath("/worker/jobs");
    revalidatePath("/customer/notifications");
    revalidatePath("/worker/notifications");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to submit review:", error);
    return { success: false, error: error.message };
  }
}
