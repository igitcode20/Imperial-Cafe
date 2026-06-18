export default function Evidencias({ evidencias, documentos }) {
  return (
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
                <img
                  src={item.archivo_url}
                  alt={item.titulo}
                />
                <div className="evidencia-overlay">
                  <span className="evidencia-tipo">📷 {item.categoria || "Evidencia"}</span>
                </div>
              </div>
              <div className="evidencia-info">
                <h4>{item.titulo}</h4>
                {item.descripcion && <p>{item.descripcion}</p>}
              </div>
            </div>
          ))}
        </div>

        {documentos && documentos.length > 0 && (
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
                  <span>📄</span>
                  <span>{doc.titulo}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}