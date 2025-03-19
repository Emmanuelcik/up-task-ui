import { useQuery } from "@tanstack/react-query";
import { getAuthenticatedUserInfo } from "@/api/AuthAPI";

export const useAuth = () => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getAuthenticatedUserInfo,
    retry: 1,
    // onError: (error) => {
    //   console.error("Error fetching auth data:", error);
    //   toast.error("Error fetching auth data");
    // },
    refetchOnWindowFocus: false,
  });

  return { data, isError, isLoading };
};
