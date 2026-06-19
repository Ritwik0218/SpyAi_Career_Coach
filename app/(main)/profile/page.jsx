import { redirect } from "next/navigation";
import { industries } from "@/data/industries";
import ProfileForm from "./_components/profile-form";
import { getUserProfile } from "@/actions/user";

export default async function ProfilePage() {
  const profile = await getUserProfile();

  if (!profile) {
    redirect("/sign-in");
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 max-w-4xl">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-violet-400 to-indigo-500 bg-clip-text text-transparent mb-2">
          Your Professional Profile
        </h1>
        <p className="text-muted-foreground text-lg">
          Update your career trajectory, experience, and core skills to calibrate your AI coaching.
        </p>
      </div>

      <ProfileForm initialData={profile} industries={industries} />
    </div>
  );
}
