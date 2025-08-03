import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <SignIn 
      appearance={{
        baseTheme: "dark"
      }}
      afterSignInUrl="/onboarding"
      redirectUrl="/onboarding"
      forceRedirectUrl="/onboarding"
    />
  );
}
