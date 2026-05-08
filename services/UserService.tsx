import { doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export const UserService = {
    atualizar: async (id: string, usuario: any) => {
        const ref = doc(db, "usuarios", id);
        await updateDoc(ref, { ...usuario });
    },
};