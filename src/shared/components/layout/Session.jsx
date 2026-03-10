import { useAuth } from "../../auth/AuthContext";

export default function SessionLog(){
     const { user, logout } = useAuth();
    return( <button className="nav-logout" onClick={logout}>
              Cerrar Sesion {user.nombre}
            </button>)
}