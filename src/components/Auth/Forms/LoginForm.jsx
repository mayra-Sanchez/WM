import { useForm } from "react-hook-form";
import { useState } from "react";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";
import "../AuthLayout/AuthLayout.css";
import { loginUser } from "../../../api/Auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

export function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword(!showPassword);

  const onSubmit = async (data) => {
    try {
      const res = await loginUser(data);
      const { access, refresh, user } = res.data;

      login({ access, refresh, user });

      Swal.fire({
        icon: "success",
        title: "¡Bienvenido!",
        text: `Hola ${user.name || user.email}, has iniciado sesión correctamente.`,
        confirmButtonColor: "#e63946",
      }).then(() => {
        window.location.reload();
      });

  setTimeout(() => {
    if (user.role === "admin") {
      navigate("/dashboard/");
    } else {
      navigate("/");
    }
  }, 500);
} catch (error) {
  console.error("ERROR LOGIN", error);
  Swal.fire({
    icon: "error",
    title: "Error de autenticación",
    text: error.response?.data?.detail || "Correo o contraseña incorrectos.",
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

    {Object.keys(errors).length > 0 && (
      <p className="text-sm text-red-400 -mt-2">Todos los campos son obligatorios</p>
    )}

    <button
      type="submit"
      disabled={!isValid}
      className={!isValid ? "disabled-button" : ""}
    >
      Entrar
    </button>
  </form>
);
}