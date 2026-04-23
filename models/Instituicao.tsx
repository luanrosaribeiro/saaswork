import { Usuario } from './Usuario';

export class Instituicao extends Usuario {
  public nomeEmpresa: string;
  public cnpj: string;
  public responsavel: string;

  constructor(objeto?: Partial<Instituicao>) {
    super(objeto);
    this.tipo = 'instituicao';
    this.nomeEmpresa = objeto?.nomeEmpresa ?? '';
    this.cnpj = objeto?.cnpj ?? '';
    this.responsavel = objeto?.responsavel ?? '';
  }

  toFirestoreEspecifico() {
    return {
      nomeEmpresa: this.nomeEmpresa,
      cnpj: this.cnpj,
      responsavel: this.responsavel,
    };
  }
}