import { useEffect, useState } from "react";
import { deleteProduct, getProducts } from "../../../api/Products";
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import Swal from "sweetalert2";
import ProductForm from "./ProductForm";
import './ProductList.css';
import Modal from "../Modals/Modal";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const loadProducts = async () => {
        const res = await getProducts();
        console.log("Products loaded:", res.data);
        setProducts(res.data);
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: '¿Estás seguro?',
            text: '¡Esto eliminará el producto permanentemente!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#E63946',
            confirmButtonText: 'Sí, eliminar',
        });

        if (confirm.isConfirmed) {
            await deleteProduct(id);
            await Swal.fire({
                text: 'El producto ha sido eliminado.',
                confirmButtonColor: '#E63946',
                icon: 'success',
            });
            loadProducts();
        }
    };

    return (
        <div className="product-list-container">
            <table className="products-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Descuento</th>
                        <th>Categoría</th>
                        <th>Variantes</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>${product.price}</td>
                            <td>{product.discount}%</td>
                            <td>{product.category_detail || product.category}</td>
                            <td>
                                {product.variants?.length || 0} Colores / {product.variants?.reduce((acc, v) => acc + v.sizes.length, 0)} tallas
                                <button
                                    className="variant-button"
                                    onClick={() => {
                                        const detailHtml = product.variants.map((variant, idx) => {
                                            const sizesHtml = variant.sizes.map(size =>
                                                `<li><span class="size-badge">${size.size}</span> <span class="stock-text">Stock: ${size.stock}</span></li>`
                                            ).join('');
                                            return `
                                                <div class="variant-card">
                                                <p><strong>Color:</strong> ${variant.color}</p>
                                                <ul>${sizesHtml}</ul>
                                                </div>
                                            `;
                                        }).join('');

                                        Swal.fire({
                                            title: '<span style="color: #fff">Detalles de variantes</span>',
                                            html: `<div class="variant-container">${detailHtml}</div>`,
                                            width: 600,
                                            background: '#1F1F1F',
                                            color: '#F1F1F1',
                                            showCloseButton: true,
                                            confirmButtonText: 'Cerrar',
                                            confirmButtonColor: '#E63946',
                                            customClass: {
                                                popup: 'swal-wide',
                                                confirmButton: 'swal-confirm-btn',
                                            }
                                        });

                                    }}
                                >
                                    Ver variantes
                                </button>

                            </td>


                            <td>
                                <button onClick={() => { setEditingProduct(product); setShowModal(true); }} title="Editar" className="action-btn edit-btn">
                                    <FiEdit size={18} />
                                </button>
                                <button onClick={() => handleDelete(product.id)} title="Eliminar" className="action-btn delete-btn">
                                    <FiTrash2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <br />
            <button onClick={() => { setEditingProduct(null); setShowModal(true); }} className="create-btn">
                Crear Producto
            </button>



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
        </div>
    );
}

export default ProductList;