import { Fragment } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTaskById, updateTaskStatus } from "@/api/TaskApi";
import { toast } from "react-toastify";
import { formatDate } from "@/utils/utils";
import { statusTranslations } from "@/locales/en";
import { TaskStatus } from "@/types/index";

export default function TaskModalDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const projectId = params.projectId!;
  const queryParams = new URLSearchParams(location.search);
  const taskId = queryParams.get("viewTask")!;
  const show = !!taskId;

  const { data, isError, error } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => getTaskById({ taskId, projectId }),
    enabled: !!taskId,
    retry: false,
  });
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: updateTaskStatus,
    onError: (err) => {
      toast.error(err.message);
    },
    onSuccess: () => {
      toast.success("Task status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      navigate(`/projects/${projectId}`);
    },
  });

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value as TaskStatus;
    const data = {
      taskId,
      status,
      projectId,
    };
    mutate(data);
  };

  if (isError) {
    toast.error(error.message, { toastId: "error" });
    return <Navigate to={`/projects/${projectId}`} />;
  }
  if (data)
    return (
      <Transition appear show={show} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => {
            navigate(location.pathname, { replace: true });
          }}
        >
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-16">
                  <p className="text-sm text-slate-400">
                    Created: {formatDate(data.createdAt)}{" "}
                  </p>
                  <p className="text-sm text-slate-400">
                    Last Updated: {formatDate(data.updatedAt)}
                  </p>
                  <DialogTitle
                    as="h3"
                    className="font-black text-4xl text-slate-600 my-5"
                  >
                    {data.name}
                  </DialogTitle>
                  <p className="text-lg text-slate-500 mb-2">
                    Description: {data.description}
                  </p>
                  <div className="my-5 space-y-3">
                    <label className="font-bold">Status: {data.status}</label>
                    <select
                      className="w-full p-3 bg-white border border-gray-300"
                      defaultValue={data.status}
                      onChange={handleStatusChange}
                    >
                      {Object.entries(statusTranslations).map((status) => {
                        const [key, value] = status;
                        return (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    );
}
