import ProjectForm from "@/components/projects/ProjectForm";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ProjectFormData } from "types";
import { createProject } from "@/api/ProjectAPI";

const CreateProjectView = () => {
  const initialValues: ProjectFormData = {
    projectName: "",
    clientName: "",
    description: "",
  };
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const mutation = useMutation({
    mutationFn: createProject,
    onSuccess: (data) => {
      toast.success(data);
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => {},
  });

  const handleFormSubmit = (data: ProjectFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-5xl font-black">New Project</h1>
      <p className="text-2xl font-light text-gray-500">Create a New Project</p>
      <nav className="my-5">
        <Link
          className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
          to="/"
        >
          back to projects
        </Link>
      </nav>

      <form
        className="mt-10 bg-white shadow-lg p-10 rounded-lg"
        onSubmit={handleSubmit(handleFormSubmit)}
        noValidate
      >
        <ProjectForm errors={errors} register={register} />
        <input
          type="submit"
          value="Create Project"
          className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors"
        />
      </form>
    </div>
  );
};

export default CreateProjectView;
