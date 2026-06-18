import { 
  FaUsers, 
  FaSearch, 
  FaPalette, 
  FaImage, 
  FaPencilAlt, 
  FaClipboardList 
} from "react-icons/fa";

const iconMap = {
  "integrador": FaUsers,
  "metodologia-investigacion": FaSearch,
  "metodologia-diseno": FaPalette,
  "tratamiento-imagenes": FaImage,
  "ilustracion-digital": FaPencilAlt,
  "evidencias-proceso": FaClipboardList
};

export default function CardsSection({ tarjetas }) {
  return (
    <section id="metodologias" className="cards-section">
      <div className="container">
        <h2 className="section-title">Metodologías y Procesos</h2>
        <div className="cards-grid">
          {tarjetas.map((item) => {
            const IconComponent = iconMap[item.tipo] || FaClipboardList;
            return (
              <div key={item.id} className="card" id={item.tipo}>
                <div className="card-icon">
                  <IconComponent />
                </div>
                <h3>{item.titulo}</h3>
                <p>{item.descripcion}</p>
                {item.archivo_url && (
                  <div className="card-image-container">
                    <img 
                      src={item.archivo_url} 
                      alt={item.titulo}
                      className="card-image"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}