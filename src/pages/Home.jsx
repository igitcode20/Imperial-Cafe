import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Lightbox from "../components/Lightbox";
import { FaImage, FaFile, FaDownload } from "react-icons/fa";

export default function Home() {
  const [contenido, setContenido] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    obtenerContenido();
  }, []);

  async function obtenerContenido() {
    setLoading(true);
    const { data, error } = await supabase
      .from("contenido")
      .select("*")
      .order("orden", { ascending: true });

    if (error) {
      console.error("Error al obtener contenido:", error);
    } else {
      setContenido(data || []);
    }
    setLoading(false);
  }

  // Verificar si es imagen
  function esImagen(url) {
    if (!url) return false;
    const extension = url.split('.').pop()?.toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension);
  }

  // Obtener nombre del archivo
  function getFileName(url) {
    if (!url) return 'archivo';
    return url.split('/').pop();
  }

  // Obtener ícono según tipo de archivo
  function getFileIcon(url) {
    if (!url) return <FaFile />;
    const extension = url.split('.').pop()?.toLowerCase();
    
    switch(extension) {
      case 'pdf': return <span className="file-type-pdf">PDF</span>;
      case 'doc':
      case 'docx': return <span className="file-type-word">DOC</span>;
      case 'xls':
      case 'xlsx': return <span className="file-type-excel">XLS</span>;
      case 'ppt':
      case 'pptx': return <span className="file-type-ppt">PPT</span>;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
      case 'svg': return <span className="file-type-image">🖼️</span>;
      default: return <span className="file-type-file">📄</span>;
    }
  }

  const banner = contenido.find((item) => item.tipo === "banner");

  const tarjetas = contenido.filter((item) =>
    [
      "integrador",
      "metodologia-investigacion",
      "metodologia-diseno",
      "tratamiento-imagenes",
      "ilustracion-digital",
      "evidencias-proceso"
    ].includes(item.tipo)
  );

  const evidencias = contenido.filter(
    (item) => item.tipo === "evidencias"
  );

  const documentos = contenido.filter(
    (item) => item.tipo === "documentos"
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Cargando portafolio...</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      
      {/* Hero / Banner */}
      <section id="inicio" className="hero">
        {banner?.archivo_url && (
          <div className="hero-content">
            {esImagen(banner.archivo_url) ? (
              <img
                src={banner.archivo_url}
                alt={banner.titulo}
                className="hero-image"
                onClick={() => setLightboxImage(banner.archivo_url)}
                style={{ cursor: 'pointer' }}
              />
            ) : (
              <div className="hero-placeholder">
                <h2>{banner.titulo}</h2>
                <p>{banner.descripcion}</p>
                {banner.archivo_url && (
                  <a 
                    href={banner.archivo_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-download"
                  >
                    <FaDownload /> Descargar archivo
                  </a>
                )}
              </div>
            )}
            <div className="hero-overlay">
              <div className="hero-text">
                <h2 className="hero-title">Café Imperial</h2>
                <p className="hero-subtitle">Desde las Alturas de San José</p>
                <p className="hero-description">Excelencia en cada taza</p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Bienvenida */}
      <section className="bienvenida">
        <div className="container">
          <div className="welcome-content">
            <h2>Bienvenido</h2>
            <div className="welcome-decoration">
              <span className="decoration-line"></span>
              <span className="decoration-icon">☕</span>
              <span className="decoration-line"></span>
            </div>
            <p>
              Este portafolio presenta el proceso de investigación, diseño y desarrollo 
              del rediseño de la identidad visual y diseño publicitario de Café Imperial.
            </p>
            <blockquote className="welcome-quote">
              "Un buen diseño comunica, una buena marca perdura."
            </blockquote>
            <cite>© 2026 Café Imperial</cite>
          </div>
        </div>
      </section>

      {/* Metodologías / Tarjetas */}
      <section id="metodologias" className="cards-section">
        <div className="container">
          <h2 className="section-title">Metodologías y Procesos</h2>
          <div className="cards-grid">
            {tarjetas.map((item) => (
              <div key={item.id} className="card" id={item.tipo}>
                <h3>{item.titulo}</h3>
                <p>{item.descripcion}</p>
                {item.archivo_url && (
                  <div className="card-image-container">
                    {esImagen(item.archivo_url) ? (
                      <img 
                        src={item.archivo_url} 
                        alt={item.titulo}
                        className="card-image"
                        onClick={() => setLightboxImage(item.archivo_url)}
                        style={{ cursor: 'pointer' }}
                      />
                    ) : (
                      <a 
                        href={item.archivo_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="card-file-link"
                      >
                        {getFileIcon(item.archivo_url)}
                        <span>{getFileName(item.archivo_url)}</span>
                        <FaDownload />
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Evidencias */}
      <section id="evidencias" className="evidencias">
        <div className="container">
          <h2>Evidencias Destacadas</h2>
          <p className="evidencias-subtitle">
            Documentación visual del proceso creativo y desarrollo del proyecto
          </p>

          <div className="galeria">
            {evidencias.map((item) => (
              <div key={item.id} className="evidencia-card">
                <div className="evidencia-image">
                  {esImagen(item.archivo_url) ? (
                    <img
                      src={item.archivo_url}
                      alt={item.titulo}
                      onClick={() => setLightboxImage(item.archivo_url)}
                      style={{ cursor: 'pointer' }}
                    />
                  ) : (
                    <a 
                      href={item.archivo_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="evidencia-file"
                    >
                      {getFileIcon(item.archivo_url)}
                      <span>{getFileName(item.archivo_url)}</span>
                      <FaDownload />
                    </a>
                  )}
                  <div className="evidencia-overlay">
                    <span className="evidencia-tipo">
                      {esImagen(item.archivo_url) ? '📷' : '📄'} {item.categoria || "Evidencia"}
                    </span>
                  </div>
                </div>
                <div className="evidencia-info">
                  <h4>{item.titulo}</h4>
                  {item.descripcion && <p>{item.descripcion}</p>}
                </div>
              </div>
            ))}
          </div>

          {/* Documentos Complementarios */}
          {documentos.length > 0 && (
            <div className="documentos-complementarios">
              <h3>Documentos Complementarios</h3>
              <div className="documentos-grid">
                {documentos.map((doc) => (
                  <a 
                    key={doc.id} 
                    href={doc.archivo_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="documento-item"
                  >
                    <span>{getFileIcon(doc.archivo_url)}</span>
                    <span className="doc-title">{doc.titulo}</span>
                    <span className="doc-download"><FaDownload /></span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />

      {/* Lightbox */}
      {lightboxImage && (
        <Lightbox 
          imageUrl={lightboxImage} 
          alt="Imagen ampliada"
          onClose={() => setLightboxImage(null)}
        />
      )}
    </>
  );
}