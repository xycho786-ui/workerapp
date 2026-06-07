"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { getDistance } from "@/utils/distance";

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

    // Create notifications for customer
    try {
      await prisma.notification.create({
        data: {
          userId: serviceRequest.customerId,
          title: "✅ Worker Accepted Your Request",
          message: `${dbUser.name} has accepted your ${serviceRequest.category} request.`,
          category: "BOOKINGS",
          relatedId: booking.id,
          type: "INFO"
        }
      });

      await prisma.notification.create({
        data: {
          userId: serviceRequest.customerId,
          title: "🔐 Verification OTP Ready",
          message: "Your service verification OTP has been generated.",
          category: "OTP",
          relatedId: booking.id,
          type: "INFO"
        }
      });
    } catch (err) {
      console.error("Failed to create customer acceptance notifications:", err);
    }

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
    revalidatePath("/customer/jobs");
    revalidatePath("/customer/notifications");
    revalidatePath("/worker/notifications");
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

    // Fetch the booking with relations to create notifications
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        customer: true,
        worker: {
          include: {
            user: true
          }
        }
      }
    });

    if (!booking) {
      throw new Error("Booking not found");
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

    // Create notifications for Customer and Worker
    try {
      await prisma.notification.create({
        data: {
          userId: booking.customerId,
          title: "🛠 Work Started",
          message: "The worker has successfully verified the OTP and started the service.",
          category: "BOOKINGS",
          relatedId: booking.id,
          type: "INFO"
        }
      });

      await prisma.notification.create({
        data: {
          userId: booking.worker.userId,
          title: "🔐 OTP Verified",
          message: "Work has officially started.",
          category: "BOOKINGS",
          relatedId: booking.id,
          type: "INFO"
        }
      });
    } catch (err) {
      console.error("Failed to create OTP verification notifications:", err);
    }

    revalidatePath("/worker/dashboard");
    revalidatePath("/worker/jobs");
    revalidatePath("/customer/jobs");
    revalidatePath("/customer/notifications");
    revalidatePath("/worker/notifications");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to verify OTP:", error);
    return { success: false, error: error.message };
  }
}

export async function completeBooking(bookingId: string, completionImageUrl: string | null = null) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
      throw new Error("Unauthorized");
    }

    // Fetch the booking with relations to create notifications
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        customer: true,
        worker: {
          include: {
            user: true
          }
        }
      }
    });

    if (!booking) {
      throw new Error("Booking not found");
    }

    await prisma.booking.update({
      where: { id: bookingId },
      data: { 
        status: "AWAITING_PAYMENT",
        completionImage: completionImageUrl
      },
    });

    // Create notifications
    try {
      // Customer notifications
      await prisma.notification.create({
        data: {
          userId: booking.customerId,
          title: "✅ Service Completed - Payment Required",
          message: "Your service has been marked as completed. Please proceed to payment.",
          category: "BOOKINGS",
          relatedId: booking.id,
          type: "INFO"
        }
      });
    } catch (err) {
      console.error("Failed to create booking completion notifications:", err);
    }

    revalidatePath("/worker/dashboard");
    revalidatePath("/worker/jobs");
    revalidatePath("/customer/jobs");
    revalidatePath("/customer/notifications");
    revalidatePath("/worker/notifications");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to complete booking:", error);
    return { success: false, error: error.message };
  }
}

export async function rejectJobRequest(requestId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
      throw new Error("Unauthorized");
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      include: { workerProfile: true }
    });

    if (!dbUser || !dbUser.workerProfile) {
      throw new Error("Worker profile not found");
    }

    const workerId = dbUser.workerProfile.id;

    // Fetch the service request
    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { id: requestId },
      include: { customer: true }
    });

    if (!serviceRequest) {
      throw new Error("Service request not found");
    }

    // Append this worker's ID to rejectedWorkerIds
    const updatedRejected = Array.from(new Set([...serviceRequest.rejectedWorkerIds, workerId]));

    // Find all matching workers for this category who haven't rejected it
    const category = serviceRequest.category;
    const matchingWorkers = await prisma.workerProfile.findMany({
      where: {
        profession: {
          has: category
        },
        id: {
          notIn: updatedRejected
        }
      },
      include: {
        location: true
      }
    });

    let nextWorkerId: string | null = null;

    if (matchingWorkers.length > 0) {
      // Prioritize online workers first
      let activeWorkers = matchingWorkers.filter(w => w.isOnline);
      if (activeWorkers.length === 0) {
        // Fallback to all matching workers if none are online
        activeWorkers = matchingWorkers;
      }

      // Calculate distances using Haversine formula
      const customerLat = serviceRequest.latitude ?? 40.7128;
      const customerLng = serviceRequest.longitude ?? -74.0060;

      const workersWithDistance = activeWorkers.map(w => {
        const lat = w.locationLat ?? w.location?.lat ?? 40.7128;
        const lng = w.locationLng ?? w.location?.lng ?? -74.0060;
        const distance = getDistance(customerLat, customerLng, lat, lng);
        return { id: w.id, userId: w.userId, distance };
      });

      // Sort by distance ascending
      workersWithDistance.sort((a, b) => a.distance - b.distance);

      nextWorkerId = workersWithDistance[0].id;
      const nextWorkerUserId = workersWithDistance[0].userId;

      // Create notification for the next worker
      try {
        await prisma.notification.create({
          data: {
            userId: nextWorkerUserId,
            title: "📥 New Service Request",
            message: `A customer has requested your ${category} service.`,
            category: "BOOKINGS",
            relatedId: requestId,
            type: "INFO"
          }
        });
      } catch (custNotifErr) {
        console.error("Failed to notify next worker:", custNotifErr);
      }
    }

    // Update the request status and tracking
    await prisma.serviceRequest.update({
      where: { id: requestId },
      data: {
        assignedWorkerId: nextWorkerId,
        rejectedWorkerIds: updatedRejected
      }
    });

    revalidatePath("/worker/dashboard");
    revalidatePath("/worker/jobs");
    revalidatePath("/customer/jobs");
    revalidatePath("/customer/notifications");
    revalidatePath("/worker/notifications");

    return { success: true };
  } catch (error: any) {
    console.error("Failed to reject job:", error);
    return { success: false, error: error.message };
  }
}

