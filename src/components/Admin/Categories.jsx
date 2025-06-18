import { useEffect, useState, Fragment } from "react";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../../api/Categories";
import "./Categories.css";
import { FiEdit, FiTrash, FiPlus } from "react-icons/fi";
import CategoryForm from "./Forms/CategoryForm";
import CategoryModal from "./CategoryModal";

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    useEffect(() => {
        async function loadCategories() {
            try {
                const res = await getCategories();
                setCategories(res.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        }
        loadCategories();
    }, []);

    const handleEdit = (category) => {
        setEditingCategory(category);
        setShowForm(true);
    };

    const handleDelete = async (category) => {
        if (window.confirm(`¿Estás seguro de eliminar "${category.name}"?`)) {
            try {
                await deleteCategory(category.id);
                const res = await getCategories();
                setCategories(res.data);
            } catch (error) {
                console.error("Error al eliminar categoría:", error.response?.data || error.message);
            }
        }
    };

    const handleCreate = () => {
        setEditingCategory(null);
        setShowForm(true);
    };

    const handleFormSubmit = async (data) => {
        try {
            if (editingCategory) {
                await updateCategory(editingCategory.id, data);
                console.log("Categoría actualizada");
            } else {
                await createCategory(data);
                console.log("Categoría creada");
            }

            const res = await getCategories();
            setCategories(res.data);

            setShowForm(false);
            setEditingCategory(null);
        } catch (error) {
            console.error("Error al enviar datos del formulario", error);
        }
    };

    return (
        <div className="categories-container">
            {showForm && (
                <CategoryModal onClose={() => setShowForm(false)}>
                    <CategoryForm
                        category={editingCategory}
                        onSubmit={handleFormSubmit}
                        onCancel={() => setShowForm(false)}
                    />
                </CategoryModal>
            )}

            <table className="categories-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Categoría Principal</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((cat) => (
                        <Fragment key={cat.id}>
                            <tr>
                                <td>{cat.id}</td>
                                <td className="bold">{cat.name}</td>
                                <td>{cat.description}</td>
                                <td>—</td>
                                <td>
                                    <button onClick={() => handleEdit(cat)} className="action-btn edit-btn">
                                        <FiEdit />
                                    </button>
                                    <button onClick={() => handleDelete(cat)} className="action-btn delete-btn">
                                        <FiTrash />
                                    </button>
                                </td>
                            </tr>
                            {cat.subcategories.map((subcat) => (
                                <tr key={subcat.id} className="subcategory-row">
                                    <td>{subcat.id}</td>
                                    <td className="subcategory-name">↳ {subcat.name}</td>
                                    <td>{subcat.description}</td>
                                    <td>{cat.name}</td>
                                    <td>
                                        <button onClick={() => handleEdit(subcat)} className="action-btn edit-btn">
                                            <FiEdit />
                                        </button>
                                        <button onClick={() => handleDelete(subcat)} className="action-btn delete-btn">
                                            <FiTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </Fragment>
                    ))}
                </tbody>
            </table>
            <button onClick={handleCreate} className="create-btn">
                <FiPlus /> Crear Categoría
            </button>
        </div>
    );
};

export default Categories;