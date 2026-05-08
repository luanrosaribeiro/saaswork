import { Usuario } from './Usuario';
import { Escolaridade } from './Escolaridade';

export class Estudante extends Usuario {
  public cpf: string;
  public dt_nascimento: string;
  public escolaridades: Escolaridade[];

  constructor(objeto?: Partial<Estudante>) {
    super(objeto);
    this.tipo = 'estudante';
    this.cpf = objeto?.cpf ?? '';
    this.dt_nascimento = objeto?.dt_nascimento ?? '';
    this.escolaridades = (objeto?.escolaridades ?? []).map(
      (e) => new Escolaridade(e)
    );
  }

  toFirestoreEspecifico() {
    return {
      cpf: this.cpf,
      dt_nascimento: this.dt_nascimento,
      escolaridades: this.escolaridades.map((e) => e.toFirestore()),
    };
  }
}
