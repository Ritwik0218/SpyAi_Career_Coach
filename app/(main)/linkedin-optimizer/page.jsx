import { getCurrentUserWithTier } from "@/lib/check-tier";
import LinkedInClient from "./_components/linkedin-client";
import ProGate from "@/components/pro-gate";

export default async function LinkedInOptimizerPage() {
  let isPro = false;
  try {
    const { isPro: pro } = await getCurrentUserWithTier();
    isPro = pro;
  } catch (e) {
    isPro = false;
  }

  return (
    <ProGate isPro={isPro} featureName="LinkedIn Optimizer">
      <LinkedInClient />
    </ProGate>
  );
}
