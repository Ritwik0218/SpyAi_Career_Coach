import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/prisma";

export async function POST(req) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment is successful
      // Update Payment record
      const payment = await db.payment.update({
        where: { razorpayOrderId: razorpay_order_id },
        data: { 
          razorpayPaymentId: razorpay_payment_id,
          status: "SUCCESS"
        },
        include: { user: true }
      });

      // Upgrade User Tier
      if (payment && payment.userId) {
        await db.user.update({
          where: { id: payment.userId },
          data: { tier: "PRO" }
        });
      }

      return NextResponse.json({ message: "Payment verified successfully" }, { status: 200 });
    } else {
      // Invalid signature
      await db.payment.update({
        where: { razorpayOrderId: razorpay_order_id },
        data: { status: "FAILED" }
      });
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }
  } catch (error) {
    console.error("Razorpay Verify Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
