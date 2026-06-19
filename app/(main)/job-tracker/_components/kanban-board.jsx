"use client";

import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { updateJobStatus } from "@/actions/job-tracker";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import JobCard from "./job-card";
import AddJobDialog from "./add-job-dialog";
import JobDetailsDialog from "./job-details-dialog";
import { toast } from "sonner";

const COLUMNS = [
  { id: "SAVED", title: "Saved", color: "bg-slate-500/20 text-slate-400" },
  { id: "APPLIED", title: "Applied", color: "bg-blue-500/20 text-blue-400" },
  { id: "INTERVIEWING", title: "Interviewing", color: "bg-amber-500/20 text-amber-400" },
  { id: "OFFERED", title: "Offered", color: "bg-emerald-500/20 text-emerald-400" },
  { id: "REJECTED", title: "Rejected", color: "bg-rose-500/20 text-rose-400" },
];

export default function KanbanBoard({ initialJobs }) {
  const [jobs, setJobs] = useState(initialJobs || []);
  const [isMounted, setIsMounted] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    setIsMounted(true);
    setJobs(initialJobs);
  }, [initialJobs]);

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    // Optimistically update UI
    const updatedJobs = Array.from(jobs);
    const draggedJobIndex = updatedJobs.findIndex(j => j.id === draggableId);
    
    if (draggedJobIndex > -1) {
      const draggedJob = updatedJobs[draggedJobIndex];
      // Move to new array status
      const newJobs = updatedJobs.filter(j => j.id !== draggableId);
      
      const newJob = { ...draggedJob, status: destination.droppableId };
      // Insert at new index
      // But wait, the order inside the column might change. 
      // For a simple kanban, we can just change the status and let it render at the end or maintain a custom order.
      // A simple status change is fine.
      setJobs(prev => prev.map(j => j.id === draggableId ? newJob : j));

      // Update backend
      try {
        await updateJobStatus(draggableId, destination.droppableId);
        toast.success("Status updated!");
      } catch (err) {
        toast.error("Failed to update status");
        setJobs(initialJobs); // revert
      }
    }
  };

  if (!isMounted) return null; // Avoid hydration mismatch for DnD

  const getJobsByStatus = (status) => jobs.filter(job => job.status === status);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="mb-4">
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Add Job
        </Button>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4 scrollbar-thin">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 h-full min-w-max items-start">
            {COLUMNS.map((column) => (
              <div key={column.id} className="w-[320px] shrink-0 flex flex-col h-full bg-muted/30 rounded-xl border border-muted/40">
                <div className="p-4 flex items-center justify-between shrink-0 border-b border-muted/20">
                  <div className="flex items-center gap-2">
                    <div className={`px-2 py-1 rounded-md text-xs font-semibold ${column.color}`}>
                      {column.title}
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">
                      {getJobsByStatus(column.id).length}
                    </span>
                  </div>
                </div>

                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 p-3 overflow-y-auto scrollbar-thin transition-colors ${snapshot.isDraggingOver ? "bg-muted/50" : ""}`}
                    >
                      <div className="space-y-3 min-h-[150px]">
                        {getJobsByStatus(column.id).map((job, index) => (
                          <Draggable key={job.id} draggableId={job.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`transition-shadow ${snapshot.isDragging ? "shadow-xl ring-2 ring-primary/20 scale-[1.02] rounded-lg z-50 relative" : "shadow-sm rounded-lg"}`}
                                style={provided.draggableProps.style}
                                onClick={() => setSelectedJob(job)}
                              >
                                <JobCard job={job} />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>

      {isAddModalOpen && (
        <AddJobDialog 
          open={isAddModalOpen} 
          onOpenChange={setIsAddModalOpen} 
          onJobAdded={(newJob) => setJobs(prev => [newJob, ...prev])} 
        />
      )}

      <JobDetailsDialog 
        open={!!selectedJob}
        onOpenChange={(open) => {
          if (!open) setSelectedJob(null);
        }}
        job={selectedJob}
        onJobUpdated={(updatedJob) => {
          setJobs(prev => prev.map(j => j.id === updatedJob.id ? updatedJob : j));
        }}
        onJobDeleted={(deletedId) => {
          setJobs(prev => prev.filter(j => j.id !== deletedId));
        }}
      />
    </div>
  );
}
