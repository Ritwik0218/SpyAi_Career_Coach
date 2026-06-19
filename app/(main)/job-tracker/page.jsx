import { getJobApplications } from "@/actions/job-tracker";
import KanbanBoard from "./_components/kanban-board";

export const metadata = {
  title: "Job Tracker | SPY AI",
  description: "Track your job applications",
};

export default async function JobTrackerPage() {
  const jobs = await getJobApplications();

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-4 md:p-8">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Job Application Tracker</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track your job applications all in one place.
          </p>
        </div>
      </div>

      {/* The Kanban Board Client Component */}
      <KanbanBoard initialJobs={jobs} />
    </div>
  );
}
