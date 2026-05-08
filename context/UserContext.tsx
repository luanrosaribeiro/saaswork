import { createContext, useContext, useState, ReactNode } from "react";
import { Estudante } from "../models/Estudante";
import { Empresa } from "../models/Empresa";

type Usuario = Estudante | Empresa | null;

interface UserContextType {
  usuario: Usuario;
  setUsuario: (u: Usuario) => void;
}

const UserContext = createContext<UserContextType>({} as UserContextType);

export function UserProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario>(null);
  return (
    <UserContext.Provider value={{ usuario, setUsuario }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
