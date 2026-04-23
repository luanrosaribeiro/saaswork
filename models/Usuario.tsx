import { Endereco } from './Endereco';

export type TipoUsuario = 'aluno' | 'instituicao';

export abstract class Usuario {
  public id: string;
  public nome: string;
  public email: string;
  public telefone: string;
  public tipo: TipoUsuario;
  public endereco: Endereco;
  public createdAt: Date;

  constructor(objeto?: Partial<Usuario>) {
    this.id = objeto?.id ?? '';
    this.nome = objeto?.nome ?? '';
    this.email = objeto?.email ?? '';
    this.telefone = objeto?.telefone ?? '';
    this.tipo = objeto?.tipo ?? 'aluno';
    this.endereco = objeto?.endereco
      ? new Endereco(objeto.endereco)
      : new Endereco();
    this.createdAt = objeto?.createdAt ?? new Date();
  }

  toFirestoreBase() {
    return {
      id: this.id,
      nome: this.nome,
      email: this.email,
      telefone: this.telefone,
      tipo: this.tipo,
      endereco: this.endereco.toFirestore(),
      createdAt: this.createdAt,
    };
  }

  abstract toFirestoreEspecifico(): Record<string, any>;
}