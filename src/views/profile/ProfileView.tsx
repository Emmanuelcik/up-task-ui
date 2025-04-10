import ProfileForm from "@/components/profile/ProfileForm";
import { useAuth } from "@/hooks/useAuth";

const ProfileView = () => {
  const { data, isLoading } = useAuth();

  if (isLoading) return "loading...";
  if (data) return <ProfileForm data={data} />;
  return <div></div>;
};

export default ProfileView;
