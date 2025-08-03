import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <SignUp 
      appearance={{
        baseTheme: "dark"
      }}
      afterSignInUrl="/onboarding"
      afterSignUpUrl="/onboarding"
      redirectUrl="/onboarding"
    />
  );
}
