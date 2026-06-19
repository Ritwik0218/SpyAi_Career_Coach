import { getCurrentUserWithTier } from "@/lib/check-tier";
import OfferClient from "./_components/offer-client";
import ProGate from "@/components/pro-gate";

export default async function OfferEvaluatorPage() {
  let isPro = false;
  try {
    const { isPro: pro } = await getCurrentUserWithTier();
    isPro = pro;
  } catch (e) {
    isPro = false;
  }

  return (
    <ProGate isPro={isPro} featureName="Offer & Equity Evaluator">
      <OfferClient />
    </ProGate>
  );
}
