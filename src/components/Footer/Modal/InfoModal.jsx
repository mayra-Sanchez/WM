import "./InfoModal.css";

export default function InfoModal({ title, content, onClose }) {
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>✕</button>
        <h2 dangerouslySetInnerHTML={{ __html: title }} />
        <p>{content}</p>
      </div>
    </div>
  );
}
