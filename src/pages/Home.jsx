import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Welcome from "../components/Welcome";
import CardsSection from "../components/CardsSection";
import Evidencias from "../components/Evidencias";
import Footer from "../components/Footer";

export default function Home() {
  const [contenido, setContenido] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Cargando portafolio...</p>
      </div>
    );
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

  return (
    <>
      <Header />
      <Hero banner={banner} />
      <Welcome />
      <CardsSection tarjetas={tarjetas} />
      <Evidencias evidencias={evidencias} documentos={documentos} />
      <Footer />
    </>
  );
}