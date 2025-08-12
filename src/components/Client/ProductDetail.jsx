import React, { useEffect, useMemo, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Zoom from "react-medium-image-zoom";
import Swal from "sweetalert2";
import "react-medium-image-zoom/dist/styles.css";
import "./ProductDetail.css"; // crea estilos nuevos si quieres
import { useCart } from "../../contexts/CartContext";

const COP = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
});

const ProductDetail = () => {
    const { idSlug } = useParams();
    const id = idSlug.split("-")[0];
    const { state } = useLocation();
    const navigate = useNavigate();
    const { addItem } = useCart();

    const [product, setProduct] = useState(state?.product || null);
    const [loading, setLoading] = useState(!state?.product);
    const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
    const [selectedSize, setSelectedSize] = useState(null);
    const [mainImage, setMainImage] = useState(null);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
    }, []);

    // Carga por id si entran directo sin state
    useEffect(() => {
        let mounted = true;
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`http://127.0.0.1:8000/products/api/products/${id}/`);
                if (mounted) setProduct(data);
            } catch (e) {
                console.error(e);
            } finally {
                if (mounted) setLoading(false);
            }
        };
        if (!product) fetchProduct();
        return () => { mounted = false; };
    }, [id]); // eslint-disable-line

    // Inicialización cuando hay producto
    useEffect(() => {
        if (!product || !Array.isArray(product.variants) || product.variants.length === 0) return;

        const discountedIndex = product.variants.findIndex(v => parseFloat(v.discount) > 0);
        const defaultIndex = discountedIndex >= 0 ? discountedIndex : 0;

        const initialImage = product.variants[defaultIndex]?.images?.[0]?.image || null;

        setSelectedVariantIndex(defaultIndex);
        setSelectedSize(null);
        setMainImage(initialImage);
        setQuantity(1);

        if (initialImage) {
            const preload = new Image();
            preload.src = initialImage;
        }

        // SEO/UX: título de la pestaña
        //if (product?.name) document.title = `${product.name} | WM Sportswear`;
    }, [product]);

    const variant = useMemo(() => product?.variants?.[selectedVariantIndex] || null, [product, selectedVariantIndex]);
    const images = variant?.images || [];
    const sizes = variant?.sizes || [];
    const selectedSizeObj = sizes.find(s => s.size === selectedSize) || null;

    const isOutOfStock = () => selectedSizeObj?.stock === 0 || selectedSizeObj == null;

    const handleAddToCart = () => {
        const isLoggedIn = !!localStorage.getItem("accessToken");

        if (!isLoggedIn) {
            return Swal.fire({
                icon: "warning",
                title: "Debes iniciar sesión",
                text: "Inicia sesión para agregar productos al carrito.",
                background: "#fff",
                color: "#000",
                confirmButtonColor: "#e63946",
            });
        }

        if (isOutOfStock()) {
            return Swal.fire({
                icon: "error",
                title: "Producto agotado",
                text: "Esta talla está actualmente agotada o no ha sido seleccionada.",
                background: "#1e1e1e",
                color: "#fff",
                confirmButtonColor: "#e63946",
            });
        }

        addItem({
            variant: variant.id,
            size: selectedSizeObj.id,
            quantity: quantity,
        });

        Swal.fire({
            icon: "success",
            title: "Producto agregado",
            text: `${product.name} ha sido añadido al carrito`,
            imageUrl: mainImage,
            imageWidth: 80,
            imageHeight: 80,
            imageAlt: product.name,
            background: "#1e1e1e",
            color: "#fff",
            confirmButtonColor: "#e63946",
        });
    };

    if (loading) {
        return (
            <div className="pd-container">
                <div className="pd-skeleton">
                    <div className="pd-skel-img" />
                    <div className="pd-skel-info">
                        <div className="pd-skel-line" />
                        <div className="pd-skel-line short" />
                        <div className="pd-skel-line" />
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="pd-container">
                <p>No se encontró el producto.</p>
                <button className="pd-back" onClick={() => navigate(-1)}>Volver</button>
            </div>
        );
    }

    return (
        <div className="pd-container">
            <nav className="pd-breadcrumbs">
                <button onClick={() => navigate(-1)} className="pd-back">← Volver</button>
                <span className="pd-bc-name">{product.name}</span>
            </nav>

            <div className="pd-grid">
                {/* IZQUIERDA: Galería */}
                <div className="pd-left">
                    <div className="pd-main-img">
                        <Zoom>
                            <img
                                src={mainImage || images[0]?.image}
                                alt={product.name}
                                loading="lazy"
                            />
                        </Zoom>
                    </div>

                    {images?.length > 1 && (
                        <div className="pd-gallery">
                            {images.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img.image}
                                    alt={`Variante ${idx}`}
                                    loading="lazy"
                                    className={`pd-thumb ${mainImage === img.image ? "active" : ""}`}
                                    onClick={() => setMainImage(img.image)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* DERECHA: Info */}
                <div className="pd-right">
                    <h1 className="pd-title">{product.name}</h1>

                    <div className="pd-price">
                        {variant?.discount && parseFloat(variant.discount) > 0 ? (
                            <>
                                <span className="pd-old">{COP.format(product.price)}</span>
                                <span className="pd-new">{COP.format(variant.final_price)}</span>
                                <span className="pd-chip">-{variant.discount_label}</span>
                            </>
                        ) : (
                            <span className="pd-normal">{COP.format(product.price)}</span>
                        )}
                    </div>

                    <div className="pd-description">
                        {showFullDescription ? product.description : `${product.description?.slice(0, 140) || ""}${(product.description?.length || 0) > 140 ? "..." : ""}`}
                        {(product.description?.length || 0) > 140 && (
                            <button
                                onClick={() => setShowFullDescription(!showFullDescription)}
                                className="pd-see-more"
                            >
                                {showFullDescription ? "Ver menos" : "Ver más"}
                            </button>
                        )}
                    </div>

                    <div className="pd-variants">
                        <strong>Color:</strong>
                        <div className="pd-color-options">
                            {product.variants.map((v, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setSelectedVariantIndex(idx);
                                        setMainImage(v.images?.[0]?.image || null);
                                        setSelectedSize(null);
                                        setQuantity(1);
                                    }}
                                    className={`pd-color-btn ${selectedVariantIndex === idx ? "selected" : ""}`}
                                    aria-label={`Seleccionar color ${v.color}`}
                                >
                                    {v.color}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pd-sizes">
                        <strong>Tallas:</strong>
                        <div className="pd-size-options">
                            {sizes.map((s) => {
                                const out = s.stock === 0;
                                return (
                                    <button
                                        key={s.id}
                                        onClick={() => {
                                            if (!out) {
                                                setSelectedSize(s.size);
                                                setQuantity(1);
                                            }
                                        }}
                                        className={`pd-size ${selectedSize === s.size ? "selected" : ""} ${out ? "out" : ""}`}
                                        disabled={out}
                                        aria-label={`Talla ${s.size}${out ? " agotada" : ""}`}
                                    >
                                        {out ? <span className="pd-out-label">{s.size} 🛑</span> : s.size}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="pd-qty">
                        <strong>Cantidad:</strong>
                        <div className="pd-qty-ctrl">
                            <button
                                type="button"
                                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                                className="pd-qty-btn"
                                aria-label="Disminuir cantidad"
                            >
                                &minus;
                            </button>
                            <span className="pd-qty-val">{quantity}</span>
                            <button
                                type="button"
                                onClick={() => {
                                    if (selectedSizeObj && quantity < selectedSizeObj.stock) {
                                        setQuantity((prev) => prev + 1);
                                    } else {
                                        Swal.fire({
                                            icon: "warning",
                                            title: "Stock insuficiente",
                                            text: "No puedes agregar más productos que los disponibles.",
                                            background: "#1e1e1e",
                                            color: "#fff",
                                            confirmButtonColor: "#e63946",
                                        });
                                    }
                                }}
                                className="pd-qty-btn"
                                disabled={selectedSizeObj ? quantity >= selectedSizeObj.stock : true}
                                aria-label="Aumentar cantidad"
                            >
                                &#43;
                            </button>
                        </div>

                        {selectedSizeObj?.stock <= 5 && selectedSizeObj?.stock > 0 && (
                            <p className="pd-stock low">Quedan {selectedSizeObj.stock} disponibles</p>
                        )}
                        {selectedSizeObj?.stock === 0 && (
                            <p className="pd-stock out">Agotado</p>
                        )}
                    </div>

                    <div className="pd-actions">
                        <button
                            onClick={handleAddToCart}
                            disabled={isOutOfStock()}
                            className="pd-add"
                        >
                            {isOutOfStock() ? "Seleccione sus opciones" : "Agregar al carrito"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
