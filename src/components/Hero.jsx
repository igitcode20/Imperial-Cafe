export default function Hero({ banner }) {
  return (
    <section id="inicio" className="hero">
      {banner?.archivo_url ? (
        <div className="hero-content">
          <img
            src={banner.archivo_url}
            alt={banner.titulo || "Café Imperial"}
            className="hero-image"
          />
          <div className="hero-overlay">
            <div className="hero-text">
              <h2 className="hero-title">Café Imperial</h2>
              <p className="hero-subtitle">Desde las Alturas de San José</p>
              <p className="hero-description">Excelencia en cada taza</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="hero-placeholder">
          <div className="hero-text">
            <h2 className="hero-title">Café Imperial</h2>
            <p className="hero-subtitle">Desde las Alturas de San José</p>
          </div>
        </div>
      )}
    </section>
  );
}