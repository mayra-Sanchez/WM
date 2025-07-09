import { useEffect, useState, Fragment, useCallback } from "react";
import {
    createCategory,
    deleteCategory,
    getCategories,
    updateCategory
} from "../../api/Categories";
import { FiEdit, FiTrash, FiPlus, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CategoryForm from "./Forms/CategoryForm";
import CategoryModal from "./CategoryModal";
import "./Categories.css";

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [expandedCategories, setExpandedCategories] = useState({});

    const loadCategories = useCallback(async () => {
        try {
            setLoading(true);
            const res = await getCategories();
            setCategories(res.data);
            setFilteredCategories(res.data);
        } catch (error) {
            toast.error("Error al cargar categorías");
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCategories();
    }, [loadCategories]);

    useEffect(() => {
        if (searchTerm) {
            const filtered = categories.filter(cat =>
                cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cat.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cat.subcategories.some(sub =>
                    sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    sub.description.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
            setFilteredCategories(filtered);
        } else {
            setFilteredCategories(categories);
        }
    }, [searchTerm, categories]);

    const handleEdit = (category) => {
        setEditingCategory(category);
        setShowForm(true);
    };

    const handleDeleteClick = (category) => {
        setCategoryToDelete(category);
        setShowConfirmModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteCategory(categoryToDelete.id);
            toast.success(`Categoría "${categoryToDelete.name}" eliminada`);
            await loadCategories();
        } catch (error) {
            toast.error("Error al eliminar categoría");
            console.error("Error al eliminar categoría:", error.response?.data || error.message);
        } finally {
            setShowConfirmModal(false);
            setCategoryToDelete(null);
        }
    };

    const toggleExpandCategory = (categoryId) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId]
        }));
    };

    const handleCreate = () => {
        setEditingCategory(null);
        setShowForm(true);
    };

    const handleFormSubmit = async (data) => {
        try {
            if (editingCategory) {
                await updateCategory(editingCategory.id, data);
                toast.success("Categoría actualizada correctamente");
            } else {
                await createCategory(data);
                toast.success("Categoría creada correctamente");
            }
            await loadCategories();
            setShowForm(false);
            setEditingCategory(null);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error al procesar la solicitud");
            console.error("Error al enviar datos del formulario", error);
        }
    };

    if (loading && categories.length === 0) {
        return (
            <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Cargando categorías...</p>
            </div>
        );
    }

    return (
        <div className="categories-container">
            <div className="categories-header">
                <h2 className="categories-title">Gestión de Categorías</h2>
                <div className="categories-actions">
                    <div className="search-bar">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar categorías..."
                        />
                        <span className="search-icon">🔍</span>
                    </div>
                </div>
            </div>

            {showForm && (
                <CategoryModal onClose={() => setShowForm(false)}>
                    <CategoryForm
                        category={editingCategory}
                        onSubmit={handleFormSubmit}
                        onCancel={() => setShowForm(false)}
                        parentCategories={categories.filter(cat => !cat.parentId)}
                    />
                </CategoryModal>
            )}

            {showConfirmModal && (
                <div className="modal-overlay">
                    <div className="confirmation-modal">
                        <h3>Confirmar eliminación</h3>
                        <p>¿Estás seguro de eliminar "{categoryToDelete?.name}"? Esta acción no se puede deshacer.</p>
                        <div className="modal-actions">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="cancel-btn"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="confirm-btn"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {filteredCategories.length === 0 ? (
                <div className="empty-state">
                    <p>No se encontraron categorías</p>
                    <button onClick={handleCreate} className="empty-action-btn">
                        Crear nueva categoría
                    </button>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="categories-table">
                        <thead>
                            <tr>
                                <th style={{ width: '5%' }}>ID</th>
                                <th style={{ width: '25%' }}>Nombre</th>
                                <th style={{ width: '40%' }}>Descripción</th>
                                <th style={{ width: '15%' }}>Categoría Principal</th>
                                <th style={{ width: '15%' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCategories.map((cat) => (
                                <Fragment key={cat.id}>
                                    <tr>
                                        <td>{cat.id}</td>
                                        <td className="bold">
                                            <div className="category-name-container">
                                                {cat.subcategories.length > 0 && (
                                                    <button
                                                        onClick={() => toggleExpandCategory(cat.id)}
                                                        className="expand-btn"
                                                    >
                                                        {expandedCategories[cat.id] ?
                                                            <FiChevronUp /> : <FiChevronDown />}
                                                    </button>
                                                )}
                                                {cat.name}
                                                {cat.subcategories.length > 0 && (
                                                    <span className="subcategory-count">
                                                        ({cat.subcategories.length})
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td>{cat.description || '—'}</td>
                                        <td>{cat.parentId ? categories.find(c => c.id === cat.parentId)?.name : '—'}</td>
                                        <td>
                                            <button
                                                onClick={() => handleEdit(cat)}
                                                className="action-btn edit-btn"
                                                aria-label={`Editar ${cat.name}`}
                                            >
                                                <FiEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(cat)}
                                                className="action-btn delete-btn"
                                                aria-label={`Eliminar ${cat.name}`}
                                            >
                                                <FiTrash />
                                            </button>
                                        </td>
                                    </tr>
                                    {cat.subcategories.length > 0 && expandedCategories[cat.id] &&
                                        cat.subcategories.map((subcat) => (
                                            <tr key={subcat.id} className="subcategory-row">
                                                <td>{subcat.id}</td>
                                                <td className="subcategory-name">↳ {subcat.name}</td>
                                                <td>{subcat.description || '—'}</td>
                                                <td>{cat.name}</td>
                                                <td>
                                                    <button
                                                        onClick={() => handleEdit(subcat)}
                                                        className="action-btn edit-btn"
                                                        aria-label={`Editar ${subcat.name}`}
                                                    >
                                                        <FiEdit />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(subcat)}
                                                        className="action-btn delete-btn"
                                                        aria-label={`Eliminar ${subcat.name}`}
                                                    >
                                                        <FiTrash />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>

            )}
            <button onClick={handleCreate} className="create-btn">
                <FiPlus /> Nueva Categoría
            </button>
        </div>

    );
};

export default Categories;