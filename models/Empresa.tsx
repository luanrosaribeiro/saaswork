import { Usuario } from './Usuario';

export class Empresa extends Usuario {
  public nomeEmpresa: string;
  public cnpj: string;
  public responsavel: string;

  constructor(objeto?: Partial<Empresa>) {
    super(objeto);
    this.tipo = 'empresa';
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
