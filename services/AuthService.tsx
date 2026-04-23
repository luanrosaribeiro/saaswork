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
import { Aluno } from '../models/Aluno';
import { Instituicao } from '../models/Instituicao';
import { TipoUsuario } from '../models/Usuario';

export class AuthService {

  static async cadastrar(
    email: string,
    senha: string,
    dados: Aluno | Instituicao
  ): Promise<void> {
    const { user } = await createUserWithEmailAndPassword(auth, email, senha);
    dados.id = user.uid;
    const batch = writeBatch(db);
    const refBase = doc(db, 'usuarios', user.uid);
    batch.set(refBase, dados.toFirestoreBase());
    const colecao = dados.tipo === 'aluno' ? 'alunos' : 'instituicoes';
    const refEspecifico = doc(db, colecao, user.uid);
    batch.set(refEspecifico, dados.toFirestoreEspecifico());
    await batch.commit();
  }

  static async login(
    email: string,
    senha: string
  ): Promise<Aluno | Instituicao> {
    const { user } = await signInWithEmailAndPassword(auth, email, senha);
    return AuthService.buscarPerfil(user.uid);
  }

  static async buscarPerfil(uid: string): Promise<Aluno | Instituicao> {
    const docBase = await getDoc(doc(db, 'usuarios', uid));

    if (!docBase.exists()) {
      throw new Error('Perfil não encontrado.');
    }

    const base = docBase.data();
    const tipo: TipoUsuario = base.tipo;

    const colecao = tipo === 'aluno' ? 'alunos' : 'instituicoes';
    const docEspecifico = await getDoc(doc(db, colecao, uid));
    const especifico = docEspecifico.data() ?? {};

    if (tipo === 'aluno') {
      return new Aluno({ ...base, ...especifico });
    }

    return new Instituicao({ ...base, ...especifico });
  }

  static async logout(): Promise<void> {
    await signOut(auth);
  }

  static usuarioAtual() {
    return auth.currentUser;
  }
}