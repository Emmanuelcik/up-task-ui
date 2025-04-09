import { deleteNote } from "@/api/NoteApi";
import { useAuth } from "@/hooks/useAuth";
import { Note } from "@/types/index";
import { formatDate } from "@/utils/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

type NoteDetailProps = {
  note: Note;
};
const NoteDetail = ({ note }: NoteDetailProps) => {
  const { data, isLoading } = useAuth();
  const canDelete = useMemo(() => data?._id === note.createdBy._id, [data]);
  const params = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const projectId = params.projectId!;
  const taskId = queryParams.get("viewTask")!;
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: deleteNote,
    onError: (e) => toast.error(e.message),
    onSuccess: (data) => {
      toast.success(data);
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
    },
  });
  if (isLoading) return <p>Loading...</p>;
  return (
    <div className="flex mb-1 w-full md:w-1/2 items-center border p-2 border-gray-200 rounded-md justify-between">
      <div className=" w-full ">
        <p>
          {note.content} by:{" "}
          <span className="font-bold">{note.createdBy.name}</span>{" "}
        </p>
        <p className="text-xs text-slate-500">{formatDate(note.createdAt)}</p>
      </div>
      {canDelete && (
        <div className="flex flex-col items-start">
          <button
            className=" text-sm text-red-500 hover:text-red-700 transition-colors delay-150 duration-300 ease-in-out"
            onClick={() => {
              mutate({ projectId, taskId, noteId: note._id });
            }}
          >
            Delete
          </button>
          <button className=" text-sm text-blue-500 hover:text-blue-800 transition-colors delay-150 duration-300 ease-in-out">
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

export default NoteDetail;
