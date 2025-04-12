import { Project, TaskProject, TaskStatus } from "@/types/index";
import TaskCard from "./TaskCard";
import { statusTranslations } from "@/locales/en";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import DropTask from "./DropTask";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTaskStatus } from "@/api/TaskApi";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

type TaskListProps = {
  tasks: TaskProject[];
  canEdit: boolean;
};
type GroupedTasks = {
  [key: string]: TaskProject[];
};
const initialStatusGroups: GroupedTasks = {
  PENDING: [],
  ON_HOLD: [],
  IN_PROGRESS: [],
  UNDER_REVIEW: [],
  COMPLETED: [],
};

const statusColors: { [key: string]: string } = {
  PENDING: "border-t-slate-500",
  ON_HOLD: "border-t-red-500",
  IN_PROGRESS: "border-t-blue-500",
  UNDER_REVIEW: "border-t-amber-500",
  COMPLETED: "border-t-emerald-500",
};
const TasksList = ({ tasks, canEdit }: TaskListProps) => {
  const queryClient = useQueryClient();
  const params = useParams();
  const navigate = useNavigate();
  const projectId = params.projectId!;
  const { mutate } = useMutation({
    mutationFn: updateTaskStatus,
    onError: (err) => {
      toast.error(err.message);
    },
    onSuccess: () => {
      toast.success("Task status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      navigate(`/projects/${projectId}`);
    },
  });
  const groupedTasks = tasks.reduce((acc, task) => {
    let currentGroup = acc[task.status] ? [...acc[task.status]] : [];
    currentGroup = [...currentGroup, task];
    return { ...acc, [task.status]: currentGroup };
  }, initialStatusGroups);

  const handleDragEnd = (e: DragEndEvent) => {
    const { over, active } = e;
    if (over?.id) {
      const taskId = active.id.toString();
      const status = over.id.toString() as TaskStatus;
      mutate({ projectId, taskId, status });

      queryClient.setQueryData(["project", projectId], (prevData: Project) => {
        const updatedTasks = prevData.tasks.map((task: TaskProject) => {
          if (taskId === task._id) {
            return {
              ...task,
              status,
            };
          }
          return task;
        });

        return {
          ...prevData,
          tasks: updatedTasks,
        };
      });
    }
  };
  return (
    <>
      <h2 className="text-5xl font-black my-10">Tasks</h2>

      <div className="flex gap-5 overflow-x-scroll 2xl:overflow-auto pb-32">
        <DndContext onDragEnd={handleDragEnd}>
          {Object.entries(groupedTasks).map(([status, tasks]) => (
            <div key={status} className="min-w-[300px] 2xl:min-w-0 2xl:w-1/5">
              <h3
                className={`capitalize text-xl font-light border border-slate-300 bg-white p-3 border-t-8 ${statusColors[status]}`}
              >
                {statusTranslations[status]}
              </h3>
              <DropTask status={status} />
              <ul className="mt-5 space-y-5">
                {tasks.length === 0 ? (
                  <li className="text-gray-500 text-center pt-3">No Tasks</li>
                ) : (
                  tasks.map((task) => (
                    <TaskCard key={task._id} task={task} canEdit={canEdit} />
                  ))
                )}
              </ul>
            </div>
          ))}
        </DndContext>
      </div>
    </>
  );
};

export default TasksList;
