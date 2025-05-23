import { useForm } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";
import { User, UserProfileForm } from "@/types/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "@/api/ProfileAPi";
import { toast } from "react-toastify";

type ProfileFormProps = {
  data: User;
};
const ProfileForm = ({ data }: ProfileFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: data });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: updateProfile,
    onError: (e) => toast.error(e.message),
    onSuccess: (data) => {
      toast.success(data);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const handleEditProfile = (formData: UserProfileForm) => mutate(formData);

  return (
    <>
      <div className="mx-auto max-w-3xl g">
        <h1 className="text-5xl font-black ">Mi Perfil</h1>
        <p className="text-2xl font-light text-gray-500 mt-5">
          Aquí puedes actualizar tu información
        </p>

        <form
          onSubmit={handleSubmit(handleEditProfile)}
          className=" mt-14 space-y-5  bg-white shadow-lg p-10 rounded-l"
          noValidate
        >
          <div className="mb-5 space-y-3">
            <label className="text-sm uppercase font-bold" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Name"
              className="w-full p-3  border border-gray-200"
              {...register("name", {
                required: "User name is required",
              })}
            />
            {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
          </div>

          <div className="mb-5 space-y-3">
            <label className="text-sm uppercase font-bold" htmlFor="password">
              E-mail
            </label>
            <input
              id="text"
              type="email"
              placeholder="Tu Email"
              className="w-full p-3  border border-gray-200"
              {...register("email", {
                required: "E-mail is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "E-mail no válido",
                },
              })}
            />
            {errors.email && (
              <ErrorMessage>{errors.email.message}</ErrorMessage>
            )}
          </div>
          <input
            type="submit"
            value="Guardar Cambios"
            className="bg-fuchsia-600 w-full p-3 text-white uppercase font-bold hover:bg-fuchsia-700 cursor-pointer transition-colors"
          />
        </form>
      </div>
    </>
  );
};

export default ProfileForm;
