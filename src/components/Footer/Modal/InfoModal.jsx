import { motion, AnimatePresence } from "framer-motion";
import { FaRegTimesCircle } from "react-icons/fa";
import "./InfoModal.css";

export default function InfoModal({ title, content, onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        className="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="modal-card"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button className="modal-close-btn" onClick={onClose}>
            <FaRegTimesCircle size={24} />
          </button>
          <h2
            className="modal-title"
            dangerouslySetInnerHTML={{ __html: title }}
          />
          <p className="modal-text">{content}</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
