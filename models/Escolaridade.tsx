export class Escolaridade {
  public id: string;
  public nivelEscolaridade: string;
  public instituicao: string;
  public curso: string;
  public anoInicio: string;
  public anoConclusao: string;

  constructor(objeto?: Partial<Escolaridade>) {
    this.id = objeto?.id ?? '';
    this.nivelEscolaridade = objeto?.nivelEscolaridade ?? '';
    this.instituicao = objeto?.instituicao ?? '';
    this.curso = objeto?.curso ?? '';
    this.anoInicio = objeto?.anoInicio ?? '';
    this.anoConclusao = objeto?.anoConclusao ?? '';
  }

  toFirestore() {
    return {
      id: this.id,
      nivelEscolaridade: this.nivelEscolaridade,
      instituicao: this.instituicao,
      curso: this.curso,
      anoInicio: this.anoInicio,
      anoConclusao: this.anoConclusao,
    };
  }
}