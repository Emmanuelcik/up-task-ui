import { addUserToProjectById } from "@/api/TamApi";
import { TeamMember } from "@/types/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

type SearchResultsProps = {
  user: TeamMember;
  reset: () => void;
};

const SearchResults = ({ user, reset }: SearchResultsProps) => {
  const params = useParams();
  const projectId = params.projectId!;
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: addUserToProjectById,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      queryClient.invalidateQueries({ queryKey: ["projectTeam", projectId] });
      reset();
    },
  });

  const handleAddUserToProject = () => {
    const data = {
      projectId,
      id: user._id,
    };
    mutate(data);
  };

  return (
    <div>
      <p className="mt-10 text-center font-bold">Result: </p>
      <div className="flex justify-between items-center">
        <p>{user.name}</p>
        <button
          onClick={handleAddUserToProject}
          className="text-purple-600 hover:bg-purple-100 px-10 py-3 font-bold cursor-pointer"
        >
          Add User
        </button>
      </div>
    </div>
  );
};

export default SearchResults;
