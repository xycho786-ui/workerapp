import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ExplorerClient from "./ExplorerClient";

export default async function CustomerExplorePage(props: {
  searchParams: Promise<{ tab?: string; search?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) {
    redirect("/login");
  }

  const searchParams = await props.searchParams;
  const initialTab = searchParams.tab || "freelancers";
  const initialSearch = searchParams.search || "";

  // Fetch freelancers, products, cart items, and wishlist items in parallel
  const [freelancers, products, cartItems, wishlistItems] = await Promise.all([
    prisma.workerProfile.findMany({
      where: {
        userType: "freelancer"
      },
      include: {
        user: true
      },
      orderBy: { rating: 'desc' }
    }),
    prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    }),
    prisma.cartItem.findMany({
      where: { customerId: user.id },
      include: { product: true }
    }),
    prisma.wishlistItem.findMany({
      where: { customerId: user.id },
      select: { productId: true }
    })
  ]);

  return (
    <div className="flex flex-col h-full bg-[#F5F5F7]">
      <ExplorerClient
        initialFreelancers={freelancers}
        initialProducts={products}
        initialCart={cartItems}
        initialWishlist={wishlistItems.map(item => item.productId)}
        initialTab={initialTab}
        searchQuery={initialSearch}
        userId={user.id}
      />
    </div>
  );
}
