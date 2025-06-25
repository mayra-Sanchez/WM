import { useForm } from "react-hook-form";
import { useState } from "react";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";
import "../AuthLayout/AuthLayout.css";
import { registerUser } from "../../../api/Auth";

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword(!showPassword);

const onSubmit = async (data) => {
  try {
    const response = await registerUser(data);
    Swal.fire({
      icon: "success",
      title: "¡Registro exitoso!",
      text: "Tu cuenta ha sido creada.",
      confirmButtonColor: "#e63946",
    });
    console.log("Respuesta del servidor:", response.data);
  } catch (error) {
    console.error("Error al registrar:", error.response?.data || error.message);
    Swal.fire({
      icon: "error",
      title: "Error al registrar",
      text: error.response?.data?.detail || "Ocurrió un error inesperado.",
      confirmButtonColor: "#e63946",
    });
  }
};


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input
        {...register("name", { required: true })}
        placeholder="Nombre"
        className="auth-form-input"
      />
      <input
        {...register("last_name", { required: true })}
        placeholder="Apellido"
        className="auth-form-input"
      />
      <input
        {...register("phone_number", { required: true })}
        placeholder="Teléfono"
        className="auth-form-input"
      />
      <input
        {...register("username", { required: true })}
        placeholder="Nombre de usuario"
        className="auth-form-input"
      />
      <input
        {...register("email", { required: true })}
        type="email"
        placeholder="Correo electrónico"
        className="auth-form-input"
      />
      <div className="input-wrapper">
        <input
          {...register("password", { required: true })}
          type={showPassword ? "text" : "password"}
          placeholder="Contraseña"
          className="auth-form-input"
        />
        <span className="eye-icon" onClick={togglePassword}>
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </span>
      </div>
      <select {...register("role", { required: true })} className="auth-form-select">
        <option value="">Selecciona un rol</option>
        <option value="admin">Administrador</option>
        <option value="cliente">Cliente</option>
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
