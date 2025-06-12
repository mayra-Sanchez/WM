import { useForm } from "react-hook-form";
import { useState } from "react";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";
import "../AuthLayout/AuthLayout.css";

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword(!showPassword);

  const onSubmit = (data) => {
    Swal.fire({
      icon: "success",
      title: "¡Registro exitoso!",
      text: "Tu cuenta ha sido creada.",
      confirmButtonColor: "#e63946",
    });

    console.log("Register Data", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input
        {...register("firstName", { required: true })}
        placeholder="Nombre"
      />
      <input
        {...register("lastName", { required: true })}
        placeholder="Apellido"
      />
      <input
        {...register("phone", { required: true })}
        placeholder="Teléfono"
      />
      <input
        {...register("username", { required: true })}
        placeholder="Nombre de usuario"
      />
      <input
        {...register("email", { required: true })}
        type="email"
        placeholder="Correo electrónico"
      />
      <div className="input-wrapper">
        <input
          {...register("password", { required: true })}
          type={showPassword ? "text" : "password"}
          placeholder="Contraseña"
        />
        <span className="eye-icon" onClick={togglePassword}>
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </span>
      </div>
      <select {...register("role", { required: true })}>
        <option value="">Selecciona un rol</option>
        <option value="admin">Administrador</option>
        <option value="client">Cliente</option>
      </select>

      {Object.keys(errors).length > 0 && (
        <p className="text-sm text-red-400 -mt-2">Todos los campos son obligatorios</p>
      )}

      <button type="submit" disabled={!isValid} className={!isValid ? "disabled-button" : ""}>
        Crear Cuenta
      </button>
    </form>
  );
}
