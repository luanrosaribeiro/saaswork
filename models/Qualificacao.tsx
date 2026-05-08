export class Qualificacao {
  public id: string;
  public idEstudante: string;
  public titulo: string;
  public dt_inicio: string;
  public dt_final: string;
  public idInstituicaoEscolaridade: string;
  public instituicao_escolaridade: string;
  public carga_horaria: number;
  public idTipoQualificacao: string;
  public tipo: string;
  public createdAt: Date;

  constructor(objeto?: Partial<Qualificacao>) {
    this.id = objeto?.id ?? '';
    this.idEstudante = objeto?.idEstudante ?? '';
    this.titulo = objeto?.titulo ?? '';
    this.dt_inicio = objeto?.dt_inicio ?? '';
    this.dt_final = objeto?.dt_final ?? '';
    this.idInstituicaoEscolaridade = objeto?.idInstituicaoEscolaridade ?? '';
    this.instituicao_escolaridade = objeto?.instituicao_escolaridade ?? '';
    this.carga_horaria = objeto?.carga_horaria ?? 0;
    this.idTipoQualificacao = objeto?.idTipoQualificacao ?? '';
    this.tipo = objeto?.tipo ?? '';
    this.createdAt = objeto?.createdAt ?? new Date();
  }

  toFirestore() {
    return {
      id: this.id,
      idEstudante: this.idEstudante,
      titulo: this.titulo,
      dt_inicio: this.dt_inicio,
      dt_final: this.dt_final,
      idInstituicaoEscolaridade: this.idInstituicaoEscolaridade,
      instituicao_escolaridade: this.instituicao_escolaridade,
      carga_horaria: this.carga_horaria,
      idTipoQualificacao: this.idTipoQualificacao,
      tipo: this.tipo,
      createdAt: this.createdAt,
    };
  }
}
