import { useEffect, useState } from "react";
import "./Carrousel.css";

const images = [
  "/images/carrousel/AuditorioUTN.jpeg",
  "/images/carrousel/EntradaUTN.jpg",
  "/images/carrousel/FedeOlivos.jpeg"
];

export default function Carousel() {

  const [index, setIndex] = useState(0);

  useEffect(() => {

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);

  }, []);

  return (
    <div
      className="hero-carousel"
      style={{ backgroundImage: `url(${images[index]})` }}
    >

      <div className="hero-overlay">

        <h1>SAE GESTION</h1>
        <p>Resolviendo tus problemas desde el ingreso hasta el egreso</p>

      </div>

    </div>
  );
}