import { isAxiosError } from "axios";
import { NoteFormData, Project, Task } from "../types";
import api from "@/lib/axios";

type NoteAPIType = {
  formData: NoteFormData;
  projectId: Project["_id"];
  taskId: Task["_id"];
};

export const createNote = async ({
  projectId,
  taskId,
  formData,
}: Pick<NoteAPIType, "projectId" | "formData" | "taskId">) => {
  try {
    const url = `/projects/${projectId}/tasks/${taskId}/notes`;
    const { data } = await api.post<string>(url, formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
};
