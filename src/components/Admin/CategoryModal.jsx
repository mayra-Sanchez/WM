import { FiX } from "react-icons/fi";
import './CategoryModal.css';

const CategoryModal = ({ children, onClose }) => {
  return (
    <div className="modal-backdrop">
      <div className="category-modal-content">
        <button className="modal-close" onClick={onClose}>
          <FiX />
        </button>
        {children}
      </div>
    </div>
  );
};

export default CategoryModal;
