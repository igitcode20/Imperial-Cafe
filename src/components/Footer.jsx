import { FaInstagram, FaWhatsapp, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  return (
    <footer id="contacto" className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>Café Imperial</h3>
            <p>Desde las Alturas de San José</p>
          </div>
          
          <div className="footer-social">
            <a 
              href="https://instagram.com/Cafe_imperial_" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link"
            >
              <FaInstagram />
              <span>@Cafe_imperial_</span>
            </a>
            <a 
              href="https://wa.me/50557073749" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link"
            >
              <FaWhatsapp />
              <span>+505 5707 3749</span>
            </a>
            <a 
              href="mailto:info@cafeimperial.com" 
              className="social-link"
            >
              <FaEnvelope />
              <span>info@cafeimperial.com</span>
            </a>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2026 Café Imperial. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}