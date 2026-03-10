import { useAuth } from "../../shared/auth/AuthContext";
import { Link } from "react-router-dom";

export default function StudentMain() {

  const { user } = useAuth();

  return (
    <div>
      <h1>Panel Estudiante</h1>

      <p>Nombre: {user.nombre}</p>
      <p>Legajo: {user.legajo}</p>
      <p>Token: {user.token}</p>
       <p>ExpirationDate: {user.expiration}</p>
      <Link to="/Mis-Becas">
        <button>Ver Becas</button>
      </Link>
    </div>
  );
}