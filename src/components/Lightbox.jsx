import { useEffect, useState } from "react";
import { FaTimes, FaDownload, FaExpand, FaCompress } from "react-icons/fa";

export default function Lightbox({ imageUrl, alt, onClose }) {
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    // Cerrar con ESC
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    
    // Bloquear scroll
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const toggleZoom = () => setZoom(!zoom);

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <div className="lightbox-header">
          <span className="lightbox-title">{alt || 'Imagen'}</span>
          <div className="lightbox-actions">
            <button 
              className="lightbox-btn" 
              onClick={toggleZoom}
              title={zoom ? 'Alejar' : 'Acercar'}
            >
              {zoom ? <FaCompress /> : <FaExpand />}
            </button>
            <a 
              href={imageUrl} 
              download 
              className="lightbox-btn"
              title="Descargar imagen"
            >
              <FaDownload />
            </a>
            <button 
              className="lightbox-btn lightbox-close" 
              onClick={onClose}
              title="Cerrar (ESC)"
            >
              <FaTimes />
            </button>
          </div>
        </div>
        <div className={`lightbox-image-wrapper ${zoom ? 'zoomed' : ''}`}>
          <img 
            src={imageUrl} 
            alt={alt || 'Imagen ampliada'} 
            className="lightbox-image"
          />
        </div>
        <div className="lightbox-footer">
          <span>🖱️ Click para ampliar</span>
          <span>⌨️ ESC para cerrar</span>
        </div>
      </div>
    </div>
  );
}