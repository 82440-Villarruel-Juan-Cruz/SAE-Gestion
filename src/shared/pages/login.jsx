import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {

  const { login } = useAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const handleLogin = () => {

    const session = login(user, pass);

    if (session.id_perfil === 1) {
      navigate("/Inicio");
    } else {
      navigate("/Principal");
    }
  };

  return (
    <div>

      <h2>Login</h2>

      <input
        placeholder="usuario"
        onChange={(e) => setUser(e.target.value)}
      />

      <input
        placeholder="password"
        type="password"
        onChange={(e) => setPass(e.target.value)}
      />

      <button onClick={handleLogin}>
        Ingresar
      </button>

    </div>
  );
}