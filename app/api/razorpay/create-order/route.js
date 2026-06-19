import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount = 99900 } = await req.json(); // Default 999 INR (in paise)

    // Verify razorpay keys exist
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      // For development/demo purposes if keys are missing
      return NextResponse.json({ 
        error: "Razorpay keys missing in .env. Setup required." 
      }, { status: 500 });
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount, // amount in smallest currency unit
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);

    // Save initial payment record
    const user = await db.user.findUnique({ where: { clerkUserId: userId } });
    
    if (user) {
      await db.payment.create({
        data: {
          userId: user.id,
          razorpayOrderId: order.id,
          amount,
          currency: "INR",
        }
      });
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error("Razorpay Create Order Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
