import { Usuario } from './Usuario';
import { Escolaridade } from './Escolaridade';

export class Aluno extends Usuario {
  public escolaridades: Escolaridade[];

  constructor(objeto?: Partial<Aluno>) {
    super(objeto);
    this.tipo = 'aluno';
    this.escolaridades = (objeto?.escolaridades ?? []).map(
      (e) => new Escolaridade(e)
    );
  }

  toFirestoreEspecifico() {
    return {
      escolaridades: this.escolaridades.map((e) => e.toFirestore()),
    };
  }
}