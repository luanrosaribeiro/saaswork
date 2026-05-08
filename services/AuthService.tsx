import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  writeBatch,
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { Estudante } from '../models/Estudante';
import { Empresa } from '../models/Empresa';
import { TipoUsuario } from '../models/Usuario';

export class AuthService {

  static async cadastrar(
    email: string,
    senha: string,
    dados: Estudante | Empresa
  ): Promise<void> {
    const { user } = await createUserWithEmailAndPassword(auth, email, senha);
    dados.id = user.uid;
    const batch = writeBatch(db);
    const refBase = doc(db, 'usuarios', user.uid);
    batch.set(refBase, dados.toFirestoreBase());
    const colecao = dados.tipo === 'estudante' ? 'estudantes' : 'empresas';
    const refEspecifico = doc(db, colecao, user.uid);
    batch.set(refEspecifico, dados.toFirestoreEspecifico());
    await batch.commit();
  }

  static async login(
    email: string,
    senha: string
  ): Promise<Estudante | Empresa> {
    const { user } = await signInWithEmailAndPassword(auth, email, senha);
    return AuthService.buscarPerfil(user.uid);
  }

  static async buscarPerfil(uid: string): Promise<Estudante | Empresa> {
    const docBase = await getDoc(doc(db, 'usuarios', uid));

    if (!docBase.exists()) {
      throw new Error('Perfil não encontrado.');
    }

    const base = docBase.data();
    const tipo: TipoUsuario = base.tipo;

    const colecao = tipo === 'estudante' ? 'estudantes' : 'empresas';
    const docEspecifico = await getDoc(doc(db, colecao, uid));
    const especifico = docEspecifico.data() ?? {};

    if (tipo === 'estudante') {
      return new Estudante({ ...base, ...especifico });
    }

    return new Empresa({ ...base, ...especifico });
  }

  static async logout(): Promise<void> {
    await signOut(auth);
  }

  static usuarioAtual() {
    return auth.currentUser;
  }
}
