"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z, ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CreateWorkflowServer } from "../component/_server/server";
import { WorkflowStatus } from "@/lib/types/workflow";
import { useRouter } from "next/navigation";

export type WorkflowProps = {
  name: string;
  description: string;
};

const Workflowschema: ZodType<WorkflowProps> = z.object({
  name: z.string().min(4, { message: "A workflow must have at least 4 characters." }),
  description: z.string().min(4, { message: "A description must have at least 4 characters." }),
});

const useWorkflow = () => {
  const [loading, setLoading] = useState<boolean>(false); // Updated default value
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WorkflowProps>({
    resolver: zodResolver(Workflowschema),
  });

  // Add a workflow
  const addWorkflow = async (props: WorkflowProps) => {
    setLoading(true);
    try {
      const response = await CreateWorkflowServer(props.description, props.name, WorkflowStatus.DRAFT);

      if (response.status === 200 && response.data) {
        toast.success(response.message || "Workflow created successfully.");
        reset();
        router.replace(`/workflow/editor/${response.data.id}`); // Redirect to editor
      } else {
        toast.error(response.message || "Failed to add workflow.");
      }
    } catch (err: any) {
      console.error("Error adding workflow:", err);
      const errorMessage = err?.response?.data?.message || err.message || "Failed to add workflow.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    register,
    handleSubmit,
    reset,
    errors,
    addWorkflow,
  };
};

export default useWorkflow;
