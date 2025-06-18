import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { getCategories } from "../../../api/Categories";
import "./CategoryForm.css"; 

const CategoryForm = ({ category = null, onSubmit }) => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
      parent: category?.parent || null,
    },
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await getCategories();
        setCategories(res.data);
      } catch (error) {
        console.error("Error loading categories", error);
      }
    }

    loadCategories();
  }, []);

  const submitForm = (data) => {
    data.parent = data.parent === "" ? null : parseInt(data.parent);
    onSubmit(data);
  };

  return (
    <div className="category-form-container">
      <h2>{category ? "Editar Categoría" : "Crear Categoría"}</h2>
      <form onSubmit={handleSubmit(submitForm)} className="category-form">
        <div className="form-group">
          <label>Nombre</label>
          <input 
            {...register("name", { required: "Este campo es obligatorio" })}
          />
          {errors.name && <p className="error">{errors.name.message}</p>}
        </div>

        <div className="form-group">
          <label>Descripción</label>
          <textarea
            {...register("description")}
            rows={3}
          />
        </div>

        <div className="form-group">
          <label>Categoría Principal (opcional)</label>
          <select {...register("parent")}>
            <option value=""> Categoría Secundaria </option>
            {categories
              .filter(cat => !category || cat.id !== category.id) 
              .map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
          </select>
        </div>

        <button type="submit" className="submit-btn">
          {category ? "Actualizar" : "Crear"}
        </button>
      </form>
    </div>
  );
};

export default CategoryForm;