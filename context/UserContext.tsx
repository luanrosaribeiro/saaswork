import { createContext, useContext, useState, ReactNode } from "react";
import { Aluno } from "../models/Aluno";
import { Instituicao } from "../models/Instituicao";

type Usuario = Aluno | Instituicao | null;

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