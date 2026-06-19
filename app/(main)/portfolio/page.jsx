import { getCurrentUserWithTier } from "@/lib/check-tier";
import PortfolioClient from "./_components/portfolio-client";
import ProGate from "@/components/pro-gate";

export default async function PortfolioPage() {
  let isPro = false;
  try {
    const { isPro: pro } = await getCurrentUserWithTier();
    isPro = pro;
  } catch (e) {
    isPro = false;
  }

  return (
    <ProGate isPro={isPro} featureName="Portfolio Builder">
      <PortfolioClient />
    </ProGate>
  );
}
