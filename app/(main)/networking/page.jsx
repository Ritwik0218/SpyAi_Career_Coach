import { getCurrentUserWithTier } from "@/lib/check-tier";
import NetworkingClient from "./_components/networking-client";
import ProGate from "@/components/pro-gate";

export default async function NetworkingPage() {
  let isPro = false;
  try {
    const { isPro: pro } = await getCurrentUserWithTier();
    isPro = pro;
  } catch (e) {
    isPro = false;
  }

  return (
    <ProGate isPro={isPro} featureName="Cold Email Generator">
      <NetworkingClient />
    </ProGate>
  );
}
