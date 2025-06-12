import { useForm } from "react-hook-form";
import { useState } from "react";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";
import "../AuthLayout/AuthLayout.css";

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword(!showPassword);

  const onSubmit = (data) => {
    // Simulación
    if (data.email === "admin@example.com" && data.password === "123456") {
      Swal.fire({
        icon: "success",
        title: "¡Bienvenido!",
        text: "Has iniciado sesión correctamente.",
        confirmButtonColor: "#e63946",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error de autenticación",
        text: "Correo o contraseña incorrectos.",
        confirmButtonColor: "#e63946",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

      {Object.keys(errors).length > 0 && (
        <p className="text-sm text-red-400 -mt-2">Todos los campos son obligatorios</p>
      )}

      <button type="submit" disabled={!isValid} className={!isValid ? "disabled-button" : ""}>
        Entrar
      </button>
    </form>
  );
}
