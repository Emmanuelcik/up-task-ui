import type { ConfirmToken, NewPasswordForm } from "../../types";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import ErrorMessage from "@/components/ErrorMessage";
import { useMutation } from "@tanstack/react-query";
import { updatePasswordWithToken } from "@/api/AuthAPI";
import { toast } from "react-toastify";

type NewPasswordFormProps = {
  token: ConfirmToken["token"];
};

export default function NewPasswordForm({ token }: NewPasswordFormProps) {
  const navigate = useNavigate();
  const initialValues: NewPasswordForm = {
    password: "",
    password_confirmation: "",
  };
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const { mutate } = useMutation({
    mutationFn: updatePasswordWithToken,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      reset();
      navigate("/login");
    },
  });

  const handleNewPassword = (formData: NewPasswordForm) => {
    const data = {
      token,
      formData,
    };
    mutate(data);
  };

  const password = watch("password");

  return (
    <form
      onSubmit={handleSubmit(handleNewPassword)}
      className="space-y-8 p-10  bg-white mt-10"
      noValidate
    >
      <div className="flex flex-col gap-5">
        <label className="font-normal text-2xl" htmlFor="password">
          Password
        </label>

        <input
          id="password"
          type="password"
          placeholder="Password de Registro"
          className="w-full p-3  border-gray-300 border"
          {...register("password", {
            required: "Passord is required",
            minLength: {
              value: 8,
              message: "Password should be at least 8 characters",
            },
          })}
        />
        {errors.password && (
          <ErrorMessage>{errors.password.message}</ErrorMessage>
        )}
      </div>

      <div className="flex flex-col gap-5">
        <label htmlFor="password_confirmation" className="font-normal text-2xl">
          Repetir Password
        </label>

        <input
          id="password_confirmation"
          type="password"
          placeholder="Confirm Password"
          className="w-full p-3  border-gray-300 border"
          {...register("password_confirmation", {
            required: "Please enter your password",
            validate: (value) => value === password || "Passwords must match",
          })}
        />

        {errors.password_confirmation && (
          <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>
        )}
      </div>

      <input
        type="submit"
        value="Establecer Password"
        className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3  text-white font-black  text-xl cursor-pointer"
      />
    </form>
  );
}
