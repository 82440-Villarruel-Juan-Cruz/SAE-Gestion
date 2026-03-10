import { useAuth } from "../../../shared/auth/AuthContext";

export default function Scholarships() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Becas disponibles</h1>

      <p>Nombre: {user.nombre}</p>
      <p>Legajo: {user.legajo}</p>
      <p>Token: {user.token}</p>
    </div>
  );
}
