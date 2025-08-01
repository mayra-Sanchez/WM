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
    watch,
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
        {...register("name", { required: "El nombre es obligatorio" })}
        placeholder="Nombre"
        className="auth-form-input"
      />
      {errors.name && <p className="text-red-400 text-sm">{errors.name.message}</p>}

      <input
        {...register("last_name", { required: "El apellido es obligatorio" })}
        placeholder="Apellido"
        className="auth-form-input"
      />
      {errors.last_name && <p className="text-red-400 text-sm">{errors.last_name.message}</p>}

      <input
        {...register("phone_number", { required: "El teléfono es obligatorio" })}
        placeholder="Teléfono"
        className="auth-form-input"
      />
      {errors.phone_number && <p className="text-red-400 text-sm">{errors.phone_number.message}</p>}

      <input
        {...register("username", {
          required: "El nombre de usuario es obligatorio",
          pattern: {
            value: /^\S+$/, // No espacios
            message: "No se permiten espacios en el nombre de usuario",
          },
        })}
        placeholder="Nombre de usuario"
        className="auth-form-input"
      />
      {errors.username && <p className="text-red-400 text-sm">{errors.username.message}</p>}


      <input
        {...register("email", {
          required: "El correo es obligatorio",
          pattern: {
            value: /^\S+@\S+$/i,
            message: "Formato de correo inválido",
          },
        })}
        type="email"
        placeholder="Correo electrónico"
        className="auth-form-input"
      />
      {errors.email && <p className="text-red-400 text-sm">{errors.email.message}</p>}

      <div className="input-wrapper">
        <input
          {...register("password", {
            required: "La contraseña es obligatoria",
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{6,}$/,
              message:
                "Debe tener mayúscula, minúscula, número y carácter especial (mínimo 6)",
            },
          })}
          type={showPassword ? "text" : "password"}
          placeholder="Contraseña"
          className="auth-form-input"
        />
        <span className="eye-icon" onClick={togglePassword}>
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </span>
      </div>
      {errors.password && <p className="text-red-400 text-sm">{errors.password.message}</p>}

      <input
        type="hidden"
        value="cliente"
        {...register("role")}
      />

      <button
        type="submit"
        disabled={!isValid}
        className={!isValid ? "disabled-button" : ""}
      >
        Crear Cuenta
      </button>
    </form>
  );
}
