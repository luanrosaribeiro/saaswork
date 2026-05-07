export class Escolaridade {
  public id: string;
  public nivelEscolaridade: string;
  public idInstituicaoEscolaridade: string;
  public instituicao: string;
  public curso: string;
  public anoInicio: string;
  public anoConclusao: string;

  constructor(objeto?: Partial<Escolaridade>) {
    this.id = objeto?.id ?? '';
    this.nivelEscolaridade = objeto?.nivelEscolaridade ?? '';
    this.idInstituicaoEscolaridade = objeto?.idInstituicaoEscolaridade ?? '';
    this.instituicao = objeto?.instituicao ?? '';
    this.curso = objeto?.curso ?? '';
    this.anoInicio = objeto?.anoInicio ?? '';
    this.anoConclusao = objeto?.anoConclusao ?? '';
  }

  toFirestore() {
    return {
      id: this.id,
      nivelEscolaridade: this.nivelEscolaridade,
      idInstituicaoEscolaridade: this.idInstituicaoEscolaridade,
      instituicao: this.instituicao,
      curso: this.curso,
      anoInicio: this.anoInicio,
      anoConclusao: this.anoConclusao,
    };
  }
}
