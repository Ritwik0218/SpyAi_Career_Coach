import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <SignUp 
      appearance={{
        baseTheme: "dark"
      }}
      afterSignUpUrl="/onboarding"
      redirectUrl="/onboarding"
      forceRedirectUrl="/onboarding"
    />
  );
}
