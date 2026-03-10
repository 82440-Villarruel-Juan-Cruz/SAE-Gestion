import { createContext, useContext,useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {

const [user, setUser] = useState(() => {

    const stored = localStorage.getItem("session");

    if (!stored) return null;

    const parsed = JSON.parse(stored);

    if (Date.now() > parsed.expiration) {
        localStorage.removeItem("session");
        return null;
    }

    return parsed;
    });

  const login = (username, password) => {
    
    let fakeUser;
    if(password !== "1111"){
        if (username === "empleado") {
        fakeUser = {
            id: 1,
            nombre: "Empleado Demo",
            legajo: "EMP001",
            id_perfil: 1,
            token: "token-empleado",
            expiration:Date.now() + (30 * 60 * 1000)
        };
        } else {
        fakeUser = {
            id: 2,
            nombre: "Alumno Demo",
            legajo: "STU001",
            id_perfil: 2,
            token: "token-student",
            expiration:Date.now() + (30 * 60 * 1000)
        };
        }
        localStorage.setItem("session", JSON.stringify(fakeUser));
        setUser(fakeUser);

        return fakeUser;
    }
    else return null;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("session");
    window.location.replace("/")
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );

}
export const useAuth = () => useContext(AuthContext);