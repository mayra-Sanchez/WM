import { useEffect, useState, useCallback } from "react";
import { deleteProduct, getProducts } from "../../../api/Products";
import {
    FiEdit,
    FiTrash2,
    FiPlus,
    FiChevronDown,
    FiChevronUp,
    FiChevronLeft,
    FiChevronRight
} from 'react-icons/fi';
import ProductForm from "./ProductForm";
import Modal from "../Modals/Modal";
import './ProductList.css';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [showVariantModal, setShowVariantModal] = useState(false);
    const [selectedProductVariants, setSelectedProductVariants] = useState([]);

    // Estado para paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(10);

    const loadProducts = useCallback(async () => {
        try {
            setLoading(true);
            const res = await getProducts();
            setProducts(res.data);
            setFilteredProducts(res.data);
        } catch (error) {
            console.error("Error loading products:", error);
            alert("Error al cargar productos");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    useEffect(() => {
        if (searchTerm) {
            const filtered = products.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (product.category_detail || product.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.variants?.some(variant =>
                    variant.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    variant.sizes.some(size =>
                        size.size.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                )
            );
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts(products);
        }
    }, [searchTerm, products]);

    // Lógica de paginación
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

    // Resetear a página 1 cuando se filtra
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handleDeleteClick = (product) => {
        setProductToDelete(product);
        setShowConfirmModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteProduct(productToDelete.id);
            alert(`Producto "${productToDelete.name}" eliminado`);
            await loadProducts();
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Error al eliminar producto");
        } finally {
            setShowConfirmModal(false);
            setProductToDelete(null);
        }
    };

    const handleShowVariants = (product) => {
        setSelectedProductVariants(product.variants || []);
        setShowVariantModal(true);
    };

    const calculateTotalStock = (variants) => {
        return variants?.reduce((total, variant) => {
            return total + variant.sizes.reduce((sum, size) => sum + size.stock, 0);
        }, 0) || 0;
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'COP'
        }).format(price);
    };

    if (loading && products.length === 0) {
        return (
            <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Cargando productos...</p>
            </div>
        );
    }

    return (
        <div className="product-list-container">
            <div className="product-list-header">
                <h2 className="product-list-title">Gestión de Productos</h2>
                <div className="product-list-actions">
                    <div className="search-bar">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar productos..."
                        />
                        <span className="search-icon">🔍</span>
                    </div>
                </div>
            </div>

            {filteredProducts.length === 0 ? (
                <div className="empty-state">
                    <p>{searchTerm ? "No se encontraron productos" : "No hay productos registrados"}</p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="empty-action-btn"
                    >
                        Crear nuevo producto
                    </button>
                </div>
            ) : (
                <>
                    <div className="table-responsive">
                        <table className="products-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '25%' }}>Nombre</th>
                                    <th style={{ width: '12%' }}>Precio</th>
                                    <th style={{ width: '10%' }}>Descuento</th>
                                    <th style={{ width: '15%' }}>Categoría</th>
                                    <th style={{ width: '20%' }}>Variantes</th>
                                    <th style={{ width: '18%' }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentProducts.map(product => (
                                    <tr key={product.id}>
                                        <td>{product.name}</td>
                                        <td>
                                            {formatPrice(product.price)}
                                            {product.discount > 0 && (
                                                <span className="original-price">
                                                    {formatPrice(product.price / (1 - product.discount / 100))}
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            {product.discount > 0 ? (
                                                <span className="discount-badge">
                                                    {product.discount}%
                                                </span>
                                            ) : '—'}
                                        </td>
                                        <td>{product.category_detail || product.category || '—'}</td>
                                        <td>
                                            <div className="variant-summary">
                                                <span className="variant-count">
                                                    {product.variants?.length || 0} colores
                                                </span>
                                                <span className="variant-stock">
                                                    {calculateTotalStock(product.variants)} en stock
                                                </span>
                                                <button
                                                    onClick={() => handleShowVariants(product)}
                                                    className="variant-button"
                                                >
                                                    Ver detalles
                                                </button>
                                            </div>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => {
                                                    setEditingProduct(product);
                                                    setShowModal(true);
                                                }}
                                                className="action-btn edit-btn"
                                                aria-label={`Editar ${product.name}`}
                                            >
                                                <FiEdit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(product)}
                                                className="action-btn delete-btn"
                                                aria-label={`Eliminar ${product.name}`}
                                            >
                                                <FiTrash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Paginación */}
                    {totalPages > 1 && (
                        <div className="pagination-container">
                            <button
                                onClick={prevPage}
                                disabled={currentPage === 1}
                                className="pagination-button"
                                aria-label="Página anterior"
                            >
                                <FiChevronLeft />
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                                <button
                                    key={number}
                                    onClick={() => paginate(number)}
                                    className={`pagination-button ${currentPage === number ? 'active' : ''}`}
                                    aria-label={`Ir a página ${number}`}
                                >
                                    {number}
                                </button>
                            ))}

                            <button
                                onClick={nextPage}
                                disabled={currentPage === totalPages}
                                className="pagination-button"
                                aria-label="Página siguiente"
                            >
                                <FiChevronRight />
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Modal de formulario */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <ProductForm
                    product={editingProduct}
                    onClose={() => {
                        setShowModal(false);
                        loadProducts();
                    }}
                    onSuccess={loadProducts}
                />
            </Modal>

            {/* Modal de confirmación de eliminación */}
            {showConfirmModal && (
                <div className="modal-overlay">
                    <div className="confirmation-modal">
                        <h3>Confirmar eliminación</h3>
                        <p>¿Estás seguro de eliminar "{productToDelete?.name}"? Todos los datos asociados se perderán.</p>
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

            {/* Modal de detalles de variantes */}
            {showVariantModal && (
                <div className="modal-overlay">
                    <div className="variant-details-modal">
                        <h3>Detalles de Variantes</h3>
                        <div className="variant-container">
                            {selectedProductVariants.map((variant, idx) => (
                                <div key={idx} className="variant-card">
                                    <p><strong>Color:</strong> {variant.color}</p>
                                    {variant.color_code && (
                                        <div
                                            className="color-preview"
                                            style={{ backgroundColor: variant.color_code }}
                                        ></div>
                                    )}
                                    <ul>
                                        {variant.sizes.map(size => (
                                            <li key={size.size}>
                                                <span className="size-badge">{size.size}</span>
                                                <span className="stock-text">Stock: {size.stock}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                        <div className="modal-actions">
                            <button
                                onClick={() => setShowVariantModal(false)}
                                className="confirm-btn"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <button
                onClick={() => {
                    setEditingProduct(null);
                    setShowModal(true);
                }}
                className="create-btn"
            >
                <FiPlus /> Nuevo Producto
            </button>
        </div>
    );
};

export default ProductList;