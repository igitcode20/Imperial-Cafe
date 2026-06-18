import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUserShield, FaBars, FaTimes } from "react-icons/fa";

export default function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  const cerrarMenu = () => {
    setMenuAbierto(false);
  };

  // Bloquear scroll cuando el menú está abierto
  useEffect(() => {
    if (menuAbierto) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [menuAbierto]);

  return (
    <>
      <header className="header header-compact">
        <div className="container header-content">
          {/* Logo */}
          <div className="logo-container">
            <div className="logo">
              <img 
                src="/src/assets/images/logo-imperial.jpeg" 
                alt="Café Imperial" 
                className="logo-img"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="logo-text">
                <h1>Café Imperial</h1>
                <span>Desde las Alturas de San José</span>
              </div>
            </div>
          </div>

          {/* Botón Hamburguesa */}
          <button className="menu-toggle" onClick={toggleMenu} aria-label="Menú">
            {menuAbierto ? <FaTimes /> : <FaBars />}
          </button>

          {/* Menú de Navegación */}
          <nav className={`menu ${menuAbierto ? 'menu-abierto' : ''}`}>
            <a href="#inicio" onClick={cerrarMenu}>Inicio</a>
            <a href="#integrador" onClick={cerrarMenu}>Integrador</a>
            <a href="#metodologias" onClick={cerrarMenu}>Metodologías</a>
            <a href="#evidencias" onClick={cerrarMenu}>Evidencias</a>
            <a href="#contacto" onClick={cerrarMenu}>Contacto</a>
            
            <Link to="/login" className="admin-btn-mobile" onClick={cerrarMenu}>
              <FaUserShield /> Admin
            </Link>
          </nav>

          {/* Botón Admin (Desktop) */}
          <Link to="/login" className="admin-btn">
            <FaUserShield />
          </Link>
        </div>
      </header>

      {/* Overlay oscuro */}
      <div 
        className={`menu-overlay ${menuAbierto ? 'visible' : ''}`} 
        onClick={cerrarMenu}
      ></div>
    </>
  );
}