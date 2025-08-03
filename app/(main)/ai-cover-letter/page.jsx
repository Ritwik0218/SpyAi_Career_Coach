import { getCoverLetters } from "@/actions/cover-letter";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CoverLetterList from "./_components/cover-letter-list";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function CoverLetterPage() {
  // Check authentication first
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  let coverLetters = [];
  
  try {
    coverLetters = await getCoverLetters();
  } catch (error) {
    console.error("Failed to fetch cover letters:", error);
    // Continue with empty array for build-time
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-2 items-center justify-between mb-5">
        <h1 className="text-6xl font-bold gradient-title">My Cover Letters</h1>
        <Link href="/ai-cover-letter/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create New
          </Button>
        </Link>
      </div>

      <CoverLetterList coverLetters={coverLetters} />
    </div>
  );
}
