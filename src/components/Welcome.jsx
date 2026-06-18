export default function Welcome() {
  return (
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
  );
}