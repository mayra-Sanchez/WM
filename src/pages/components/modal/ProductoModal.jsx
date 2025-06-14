import "./ProductoModal.css";

const ProductoModal = ({ producto, onClose }) => {
  const primeraImagen = producto.variants[0]?.images[0]?.image;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="cerrar-btn" onClick={onClose}>
          ✕
        </button>
        <h2>{producto.name}</h2>
        <p>{producto.description}</p>
        <p>Precio: ${producto.price}</p>
        <p>Descuento: {producto.discount}%</p>

        {primeraImagen && (
          <img
            src={`http://localhost:8000${primeraImagen}`}
            alt="Producto"
            className="modal-imagen"
          />
        )}

        <h4>Variantes:</h4>
        {producto.variants.map((variant) => (
          <div key={variant.id} className="variant-info">
            <strong>Color:</strong> {variant.color}
            <div className="sizes-list">
              {variant.sizes.map((size) => (
                <span key={size.id}>
                  {size.size}: {size.stock} unidades
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductoModal;
