import { NoteFormData, Project } from "@/types/index";
import { useForm } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/api/NoteApi";
import { toast } from "react-toastify";
import { useLocation, useParams } from "react-router-dom";

const AddNoteForm = () => {
  const params = useParams();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const taskId = queryParams.get("viewTask")!;
  const projectId: Project["_id"] = params.projectId!;
  const initialValues: NoteFormData = {
    content: "",
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: createNote,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
    },
  });
  const handleAddNote = (formData: NoteFormData) => {
    mutate({ formData, taskId, projectId });
    reset();
  };
  return (
    <form
      onSubmit={handleSubmit(handleAddNote)}
      className="space-y-3"
      noValidate
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="content" className="font-bold">
          Add Note
        </label>
        <input
          id="content"
          type="text"
          placeholder="Note content"
          className="w-full p-3 border border-gray-300"
          {...register("content", {
            required: "Note content is required",
            minLength: {
              value: 5,
              message: "Note content must be at least 5 characters",
            },
            maxLength: {
              value: 200,
              message: "Note content must not exceed 200 characters",
            },
          })}
        />
        {errors.content && (
          <ErrorMessage>{errors.content.message}</ErrorMessage>
        )}
      </div>
      <input
        type="submit"
        value="Add note"
        className=" bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-2 text-white font-bold cursor-pointer"
      />
    </form>
  );
};

export default AddNoteForm;
