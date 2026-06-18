import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import { 
  FaImage, FaPlus, FaTrash, FaEye, 
  FaSignOutAlt, FaFile, FaFilePdf, 
  FaFileWord, FaFileExcel, FaFilePowerpoint,
  FaFileAlt, FaFolderOpen, FaDownload
} from "react-icons/fa";

export default function Dashboard() {
  const navigate = useNavigate();
  
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipo, setTipo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [contenido, setContenido] = useState([]);
  const [seccionActiva, setSeccionActiva] = useState("todas");
  const [modoVista, setModoVista] = useState("grid");
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    obtenerContenido();
  }, []);

  async function obtenerContenido() {
    const { data } = await supabase
      .from("contenido")
      .select("*")
      .order("orden", { ascending: true });

    setContenido(data || []);
  }

  // Función para obtener el ícono según el tipo de archivo
  function getFileIcon(url) {
    if (!url) return <FaFileAlt />;
    
    const extension = url.split('.').pop()?.toLowerCase();
    
    switch(extension) {
      case 'pdf': return <FaFilePdf />;
      case 'doc':
      case 'docx': return <FaFileWord />;
      case 'xls':
      case 'xlsx': return <FaFileExcel />;
      case 'ppt':
      case 'pptx': return <FaFilePowerpoint />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
      case 'svg': return <FaImage />;
      default: return <FaFileAlt />;
    }
  }

  // Función para obtener el color según el tipo de archivo
  function getFileColor(url) {
    if (!url) return '#6c757d';
    
    const extension = url.split('.').pop()?.toLowerCase();
    
    switch(extension) {
      case 'pdf': return '#dc3545';
      case 'doc':
      case 'docx': return '#0d6efd';
      case 'xls':
      case 'xlsx': return '#198754';
      case 'ppt':
      case 'pptx': return '#d63384';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
      case 'svg': return '#6f42c1';
      default: return '#6c757d';
    }
  }

  // Verificar si es una imagen
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

  async function guardarContenido(e) {
    e.preventDefault();
    setCargando(true);

    let archivoUrl = "";

    if (archivo) {
      const nombre = `${Date.now()}-${archivo.name}`;

      const { error } = await supabase.storage
        .from("cafe-imperial")
        .upload(nombre, archivo);

      if (error) {
        alert(`Error al subir archivo: ${error.message}`);
        setCargando(false);
        return;
      }

      const { data } = supabase.storage
        .from("cafe-imperial")
        .getPublicUrl(nombre);

      archivoUrl = data.publicUrl;
    }

    const { error } = await supabase
      .from("contenido")
      .insert({
        titulo,
        descripcion,
        tipo,
        categoria: categoria || "general",
        archivo_url: archivoUrl
      });

    if (error) {
      alert(`Error al guardar: ${error.message}`);
      setCargando(false);
      return;
    }

    setTitulo("");
    setDescripcion("");
    setTipo("");
    setCategoria("");
    setArchivo(null);
    
    document.getElementById('file-input').value = '';

    await obtenerContenido();
    setCargando(false);
    alert("¡Contenido guardado exitosamente!");
  }

  async function eliminarContenido(item) {
    const confirmar = window.confirm(
      "¿Eliminar este contenido?"
    );

    if (!confirmar) return;

    if (item.archivo_url) {
      const nombreArchivo = item.archivo_url
        .split("/")
        .pop();

      await supabase.storage
        .from("cafe-imperial")
        .remove([nombreArchivo]);
    }

    await supabase
      .from("contenido")
      .delete()
      .eq("id", item.id);

    await obtenerContenido();
  }

  // Cerrar sesión y redirigir al Home
  async function cerrarSesion() {
    const confirmar = window.confirm("¿Estás seguro de que quieres cerrar sesión?");
    
    if (!confirmar) return;
    
    await supabase.auth.signOut();
    navigate("/"); // ← Redirige al Home
  }

  // Filtrar contenido por sección
  const contenidoFiltrado = seccionActiva === "todas" 
    ? contenido 
    : contenido.filter(item => item.tipo === seccionActiva);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Panel de Administración</h1>
        <div className="dashboard-actions">
          <button 
            className={`view-toggle ${modoVista === 'grid' ? 'active' : ''}`}
            onClick={() => setModoVista('grid')}
          >
            <FaEye /> Grid
          </button>
          <button 
            className={`view-toggle ${modoVista === 'preview' ? 'active' : ''}`}
            onClick={() => setModoVista('preview')}
          >
            <FaEye /> Lista
          </button>
          <button 
            className="logout-btn"
            onClick={cerrarSesion}
          >
            <FaSignOutAlt /> Cerrar Sesión
          </button>
        </div>
      </div>

      <div className="dashboard-layout">
        {/* Panel Izquierdo: Formulario */}
        <div className="dashboard-form-panel">
          <h2>Agregar Nuevo Contenido</h2>
          <form onSubmit={guardarContenido} className="admin-form">
            <input
              type="text"
              placeholder="Título *"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />

            <textarea
              placeholder="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />

            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              required
            >
              <option value="">Selecciona una sección *</option>
              <option value="banner">📸 Banner</option>
              <option value="integrador">👥 Integrador</option>
              <option value="metodologia-investigacion">🔍 Metodología de investigación</option>
              <option value="metodologia-diseno">🎨 Metodología del diseño</option>
              <option value="tratamiento-imagenes">🖼️ Tratamiento de imágenes</option>
              <option value="ilustracion-digital">✏️ Ilustración digital</option>
              <option value="evidencias-proceso">📋 Evidencias del proceso</option>
              <option value="evidencias">🖼️ Evidencias destacadas</option>
              <option value="documentos">📄 Documentos</option>
            </select>

            <input
              type="text"
              placeholder="Categoría (ej: branding, diseño, fotografía)"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            />

            <div className="file-input-wrapper">
              <label className="file-input-label">
                <FaFolderOpen /> Seleccionar archivo
                <input
                  id="file-input"
                  type="file"
                  onChange={(e) => setArchivo(e.target.files[0])}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.webp,.svg"
                />
              </label>
              {archivo && (
                <span className="file-name">
                  {getFileIcon(archivo.name)} {archivo.name}
                  <small>({(archivo.size / 1024).toFixed(1)} KB)</small>
                </span>
              )}
              <small className="file-hint">
                Formatos soportados: PDF, Word, Excel, PowerPoint, Imágenes (JPG, PNG, GIF, etc.)
              </small>
            </div>

            <button type="submit" disabled={cargando}>
              {cargando ? (
                <>⏳ Guardando...</>
              ) : (
                <><FaPlus /> Guardar Contenido</>
              )}
            </button>
          </form>

          {/* Vista Previa del Formulario */}
          <div className="form-preview">
            <h3>Vista Previa</h3>
            <div className="preview-card">
              {titulo && <h4>{titulo}</h4>}
              {descripcion && <p>{descripcion}</p>}
              {archivo && (
                <div className="preview-file">
                  {getFileIcon(archivo.name)}
                  <span>{archivo.name}</span>
                  {esImagen(archivo.name) && (
                    <img 
                      src={URL.createObjectURL(archivo)} 
                      alt="Vista previa"
                      className="preview-image"
                    />
                  )}
                </div>
              )}
              {tipo && (
                <span className="preview-tag">Sección: {tipo}</span>
              )}
            </div>
          </div>
        </div>

        {/* Panel Derecho: Contenido Existente */}
        <div className="dashboard-content-panel">
          <div className="content-filters">
            <button 
              className={`filter-btn ${seccionActiva === 'todas' ? 'active' : ''}`}
              onClick={() => setSeccionActiva('todas')}
            >
              Todas ({contenido.length})
            </button>
            <button 
              className={`filter-btn ${seccionActiva === 'banner' ? 'active' : ''}`}
              onClick={() => setSeccionActiva('banner')}
            >
              📸 Banner
            </button>
            <button 
              className={`filter-btn ${seccionActiva === 'integrador' ? 'active' : ''}`}
              onClick={() => setSeccionActiva('integrador')}
            >
              👥 Integrador
            </button>
            <button 
              className={`filter-btn ${seccionActiva === 'metodologia-investigacion' ? 'active' : ''}`}
              onClick={() => setSeccionActiva('metodologia-investigacion')}
            >
              🔍 Metodologías
            </button>
            <button 
              className={`filter-btn ${seccionActiva === 'evidencias' ? 'active' : ''}`}
              onClick={() => setSeccionActiva('evidencias')}
            >
              🖼️ Evidencias
            </button>
            <button 
              className={`filter-btn ${seccionActiva === 'documentos' ? 'active' : ''}`}
              onClick={() => setSeccionActiva('documentos')}
            >
              📄 Documentos
            </button>
          </div>

          <div className="content-list">
            <h3>Contenido Existente ({contenidoFiltrado.length})</h3>
            
            {contenidoFiltrado.length === 0 ? (
              <div className="empty-state">
                <p>📭 No hay contenido en esta sección</p>
                <span>Agrega contenido usando el formulario</span>
              </div>
            ) : (
              <div className={`content-items ${modoVista}`}>
                {contenidoFiltrado.map((item) => (
                  <div key={item.id} className="content-item">
                    <div className="item-header">
                      <span className="item-tipo">{item.tipo}</span>
                      <button 
                        onClick={() => eliminarContenido(item)}
                        className="delete-btn"
                      >
                        <FaTrash /> Eliminar
                      </button>
                    </div>
                    
                    <div className="item-body">
                      <h4>{item.titulo}</h4>
                      {item.descripcion && <p>{item.descripcion}</p>}
                      {item.archivo_url && (
                        <div className="item-file">
                          <div className="file-icon" style={{ color: getFileColor(item.archivo_url) }}>
                            {getFileIcon(item.archivo_url)}
                          </div>
                          <a 
                            href={item.archivo_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="file-link"
                          >
                            <FaDownload /> {getFileName(item.archivo_url)}
                          </a>
                          {esImagen(item.archivo_url) && (
                            <a 
                              href={item.archivo_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="item-image-link"
                            >
                              <div className="item-image">
                                <img src={item.archivo_url} alt={item.titulo} />
                                <div className="image-overlay">
                                  <span>🔍 Ver imagen</span>
                                </div>
                              </div>
                            </a>
                          )}
                        </div>
                      )}
                      {item.categoria && (
                        <span className="item-categoria">#{item.categoria}</span>
                      )}
                    </div>

                    <div className="item-footer">
                      <span className="item-date">
                        {new Date(item.created_at).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Vista Previa del Sitio */}
      <div className="site-preview">
        <h2>📱 Vista Previa del Sitio</h2>
        <div className="preview-container">
          {/* Banner */}
          {contenido.find(item => item.tipo === 'banner') && (
            <div className="preview-section preview-banner">
              {(() => {
                const banner = contenido.find(item => item.tipo === 'banner');
                return banner?.archivo_url && esImagen(banner.archivo_url) ? (
                  <a href={banner.archivo_url} target="_blank" rel="noopener noreferrer">
                    <img src={banner.archivo_url} alt="Banner" />
                  </a>
                ) : (
                  <div className="preview-placeholder">
                    <h3>{banner?.titulo || 'Banner'}</h3>
                    <p>{banner?.descripcion || 'Contenido del banner'}</p>
                    {banner?.archivo_url && (
                      <a href={banner.archivo_url} target="_blank" rel="noopener noreferrer" className="preview-download-btn">
                        <FaDownload /> Descargar archivo
                      </a>
                    )}
                  </div>
                );
              })()}
              <span className="preview-label">📸 Banner</span>
            </div>
          )}

          {/* Tarjetas de Metodologías */}
          <div className="preview-section preview-cards">
            <h3>📚 Metodologías</h3>
            <div className="preview-grid">
              {contenido
                .filter(item => ['integrador', 'metodologia-investigacion', 'metodologia-diseno', 'tratamiento-imagenes', 'ilustracion-digital', 'evidencias-proceso'].includes(item.tipo))
                .slice(0, 6)
                .map(item => (
                  <div key={item.id} className="preview-card-small">
                    <h4>{item.titulo}</h4>
                    {item.descripcion && <p>{item.descripcion.substring(0, 60)}...</p>}
                    {item.archivo_url && (
                      <a href={item.archivo_url} target="_blank" rel="noopener noreferrer" className="preview-file-link">
                        {getFileIcon(item.archivo_url)} Ver archivo
                      </a>
                    )}
                    <span className="preview-label">{item.tipo.replace('-', ' ')}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Evidencias */}
          {contenido.filter(item => item.tipo === 'evidencias').length > 0 && (
            <div className="preview-section preview-evidencias">
              <h3>🖼️ Evidencias</h3>
              <div className="preview-grid">
                {contenido
                  .filter(item => item.tipo === 'evidencias')
                  .slice(0, 4)
                  .map(item => (
                    <div key={item.id} className="preview-card-small">
                      {item.archivo_url && esImagen(item.archivo_url) ? (
                        <a href={item.archivo_url} target="_blank" rel="noopener noreferrer">
                          <img src={item.archivo_url} alt={item.titulo} />
                        </a>
                      ) : (
                        <div className="file-placeholder">
                          {getFileIcon(item.archivo_url)}
                          <span>{getFileName(item.archivo_url)}</span>
                          {item.archivo_url && (
                            <a href={item.archivo_url} target="_blank" rel="noopener noreferrer" className="file-download-link">
                              <FaDownload /> Descargar
                            </a>
                          )}
                        </div>
                      )}
                      <h4>{item.titulo}</h4>
                      <span className="preview-label">📄 Documento</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Documentos */}
          {contenido.filter(item => item.tipo === 'documentos').length > 0 && (
            <div className="preview-section preview-documentos">
              <h3>📄 Documentos</h3>
              <div className="documentos-grid">
                {contenido
                  .filter(item => item.tipo === 'documentos')
                  .map(item => (
                    <a 
                      key={item.id}
                      href={item.archivo_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="documento-item"
                    >
                      <span style={{ color: getFileColor(item.archivo_url) }}>
                        {getFileIcon(item.archivo_url)}
                      </span>
                      <span className="doc-title">{item.titulo}</span>
                      <span className="doc-download"><FaDownload /></span>
                    </a>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}