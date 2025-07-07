import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { getCategories } from '../../../api/Categories';
import { createProduct, deleteImage, updateProduct, uploadImage } from "../../../api/Products";
import { FiTrash2 } from 'react-icons/fi';
import Swal from "sweetalert2";
import './ProductForm.css';

const ProductForm = ({ product, onClose, onSuccess }) => {
    const [categories, setCategories] = useState([]);
    const isEdit = Boolean(product);
    const sizeOptions = ['XS', 'S', 'M', 'L', 'XL'];
    const [activeTab, setActiveTab] = useState('producto');

    const { register, control, handleSubmit, reset, setValue, watch } = useForm({
        defaultValues: {
            name: '',
            description: '',
            price: '',
            category: '',
            variants: [],
        },
    });

    const { fields: variantsFields, append: appendVariant, remove: removeVariant } = useFieldArray({
        control,
        name: 'variants',
    });

    const watchVariants = watch('variants');
    const [variantSizes, setVariantSizes] = useState({});

    const flattenCategories = (categories, prefix = '') => {
        return categories.reduce((acc, category) => {
            acc.push({
                id: category.id,
                name: prefix + category.name
            });

            if (category.subcategories && category.subcategories.length > 0) {
                const children = flattenCategories(category.subcategories, prefix + category.name + ' > ');
                acc = acc.concat(children);
            }

            return acc;
        }, []);
    };

    const loadCategories = async () => {
        try {
            const res = await getCategories();
            const flat = flattenCategories(res.data);
            setCategories(flat);
        } catch (error) {
            console.error("Error loading categories:", error);
        }
    };

    const addSizeToVariant = (variantIndex) => {
        setVariantSizes(prev => {
            const current = prev[variantIndex] || [];
            return {
                ...prev,
                [variantIndex]: [...current, { size: '', stock: 0 }]
            };
        });
    };

    const removeSizeFromVariant = (variantIndex, sizeIndex) => {
        setVariantSizes(prev => {
            const updated = [...(prev[variantIndex] || [])];
            updated.splice(sizeIndex, 1);
            return {
                ...prev,
                [variantIndex]: updated
            };
        });
    };

    const handleSizeChange = (variantIndex, sizeIndex, field, value) => {
        setVariantSizes(prev => {
            const updated = [...(prev[variantIndex] || [])];
            updated[sizeIndex][field] = value;
            return {
                ...prev,
                [variantIndex]: updated
            };
        });
    };

    const handleImageUpload = async (e, variantId, variantIndex) => {
        const files = Array.from(e.target.files);
        if (!variantId) {
            return Swal.fire('Error', 'Debes guardar el producto antes de subir imágenes.', 'error');
        }

        for (const file of files) {
            const formData = new FormData();
            formData.append('variant', variantId);
            formData.append('image', file);

            try {
                const res = await uploadImage(formData);
                // Agregar la nueva imagen a la variante visualmente
                setValue(`variants.${variantIndex}.images`, [
                    ...(watch(`variants.${variantIndex}.images`) || []),
                    res.data
                ]);
            } catch (err) {
                console.error('Error subiendo imagen:', err);
            }
        }

        e.target.value = ''; // limpiar input
    };

    const handleImageDelete = async (imageId, variantIndex) => {
        const result = await Swal.fire({
            title: '¿Eliminar imagen?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#E63946',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await deleteImage(imageId);
                const currentImages = watch(`variants.${variantIndex}.images`) || [];
                setValue(`variants.${variantIndex}.images`, currentImages.filter(img => img.id !== imageId));
                Swal.fire('Eliminada', 'La imagen ha sido eliminada.', 'success');
            } catch (err) {
                console.error('Error eliminando imagen:', err);
                Swal.fire('Error', 'No se pudo eliminar la imagen.', 'error');
            }
        }
    };

    useEffect(() => {
        loadCategories();

        if (product) {
            reset(product);
            const sizesByVariant = {};
            product.variants.forEach((variant, index) => {
                sizesByVariant[index] = variant.sizes.map(size => ({
                    id: size.id,
                    size: size.size,
                    stock: size.stock
                }));
            });
            setVariantSizes(sizesByVariant);
        }
    }, [product]);

    const onSubmit = async (data) => {
        const payload = {
            ...data,
            variants: data.variants.map((variant, idx) => {
                const { images, ...rest } = variant; // 👈 eliminamos imágenes
                return {
                    ...rest,
                    sizes: (variantSizes[idx] || []).map(size => ({
                        id: size.id || null,
                        size: size.size,
                        stock: size.stock
                    }))
                };
            })
        };

        try {
            if (isEdit) {
                await updateProduct(product.id, payload);
                Swal.fire({
                    title: 'Actualizado',
                    text: 'Producto actualizado correctamente.',
                    icon: 'success',
                    confirmButtonColor: '#E63946',
                });
            } else {
                await createProduct(payload);
                Swal.fire({
                    title: 'Creado',
                    text: 'Producto creado correctamente.',
                    icon: 'success',
                    confirmButtonColor: '#E63946',
                });
            }
            onClose();
            if (typeof onSuccess === "function") {
                onSuccess();
            }
        } catch (error) {
            console.error("Error añadiendo producto:", error.response?.data || error);
        }
    };

    return (
        <div className="product-form">
            <h3>{isEdit ? 'Editar Producto' : 'Crear Producto'}</h3>

            <div className="form-tabs">
                <button onClick={() => setActiveTab('producto')} className={activeTab === 'producto' ? 'active' : ''}>Producto</button>
                <button onClick={() => setActiveTab('variantes')} className={activeTab === 'variantes' ? 'active' : ''}>Variantes</button>
                <button onClick={() => setActiveTab('tallas')} className={activeTab === 'tallas' ? 'active' : ''}>Tallas</button>
                <button onClick={() => setActiveTab('imagenes')} className={activeTab === 'imagenes' ? 'active' : ''}>Imágenes</button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>

                {activeTab === 'producto' && (
                    <div className="tab-section">
                        <div className="grid-2">
                            <input {...register('name')} placeholder="Nombre" required className="product-form-input" />
                            <input {...register('description')} placeholder="Descripción" required className="product-form-input" />
                            <input type="number" step="0.01" {...register('price')} placeholder="Precio" required className="product-form-input" />
                            <select {...register('category')} required className="product-form-select">
                                <option value="">Selecciona una categoría</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                {activeTab === 'variantes' && (
                    <div className="tab-section">
                        {variantsFields.map((variant, variantIndex) => (
                            <div key={variant.id} className="variant-card">
                                <div className="variant-header">
                                    <h5>Variante {variantIndex + 1}</h5>
                                    <button type="button" onClick={() => removeVariant(variantIndex)} className="delete-variant-btn"><FiTrash2 /></button>
                                </div>
                                <input
                                    {...register(`variants.${variantIndex}.color`)}
                                    placeholder="Color"
                                    required
                                    className="product-form-input"
                                />
                                <input
                                    {...register(`variants.${variantIndex}.discount`)}
                                    type="number"
                                    step="0.01"
                                    placeholder="Descuento (%)"
                                    className="product-form-input"
                                />
                                {/* Mostrar el precio final con descuento */}
                                <p>Precio final: {watchVariants[variantIndex]?.final_price}</p>
                            </div>
                        ))}

                        <div className="variant-actions">
                            <button type="button" onClick={() => {
                                appendVariant({ color: '', discount: 0 });  // Inicializa el descuento por defecto en 0
                                setVariantSizes(prev => ({ ...prev, [variantsFields.length]: [] }));
                            }} className="add-variant-btn">+ Añadir Variante</button>
                        </div>
                    </div>
                )}

                {activeTab === 'tallas' && (
                    <div className="tab-section">
                        {variantsFields.map((variant, variantIndex) => (
                            <div key={variant.id} className="variant-card">
                                <h5>Tallas para: {watchVariants[variantIndex]?.color || `Variante ${variantIndex + 1}`}</h5>
                                {(variantSizes[variantIndex] || []).map((sizeObj, sizeIndex) => (
                                    <div key={sizeIndex} className="variant-sizes-row">
                                        <select
                                            value={sizeObj.size}
                                            onChange={e => handleSizeChange(variantIndex, sizeIndex, 'size', e.target.value)}
                                            required
                                            className="product-form-select"
                                        >
                                            <option value="">Talla</option>
                                            {sizeOptions.map(size => {
                                                const usedSizes = (variantSizes[variantIndex] || []).map(s => s.size);
                                                const isCurrent = size === sizeObj.size;
                                                const isUsed = usedSizes.includes(size);

                                                if (isUsed && !isCurrent) return null; // Oculta si ya fue seleccionada y no es la actual

                                                return <option key={size} value={size}>{size}</option>;
                                            })}
                                        </select>

                                        <input
                                            type="number"
                                            value={sizeObj.stock}
                                            onChange={e => handleSizeChange(variantIndex, sizeIndex, 'stock', parseInt(e.target.value))}
                                            placeholder="Stock"
                                            required
                                            className="product-form-input"
                                        />
                                        <button type="button" className="delete-size" onClick={() => removeSizeFromVariant(variantIndex, sizeIndex)}><FiTrash2 /></button>
                                    </div>
                                ))}
                                <button type="button" onClick={() => addSizeToVariant(variantIndex)} className="add-size-btn">+ Talla</button>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'imagenes' && (
                    <div className="tab-section">
                        {watchVariants.map((variant, variantIndex) => (
                            <div key={variantIndex} className="variant-card">
                                <h5>Imágenes para: {variant.color || `Variante ${variantIndex + 1}`}</h5>

                                {/* Input para subir nuevas imágenes */}
                                <div className="image-upload-wrapper">
                                    <label className="upload-btn">
                                        Subir imágenes
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={e => handleImageUpload(e, variant.id, variantIndex)}
                                        />
                                    </label>

                                    <div className="image-grid">
                                        {(variant.images || []).map((img, imgIndex) => (
                                            <div key={img.id} className="image-card">
                                                <img src={img.image} alt={`Imagen ${imgIndex}`} />
                                                <button
                                                    type="button"
                                                    className="delete-image-btn"
                                                    onClick={() => handleImageDelete(img.id, variantIndex)}
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                )}

                <div className="actions">
                    <button type="submit">{isEdit ? 'Actualizar' : 'Crear'}</button>
                    <button type="button" onClick={onClose} className="cancel-btn">Cancelar</button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;