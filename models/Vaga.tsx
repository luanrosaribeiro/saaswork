export class Vaga {
  public id: string;
  public idEmpresa: string;
  public descricao: string;
  public exigencias: string;
  public cargaHoraria: number;
  public idTipoVaga: string;

  constructor(objeto?: Partial<Vaga>) {
    this.id = objeto?.id ?? '';
    this.idEmpresa = objeto?.idEmpresa ?? '';
    this.descricao = objeto?.descricao ?? '';
    this.exigencias = objeto?.exigencias ?? '';
    this.cargaHoraria = objeto?.cargaHoraria ?? 0;
    this.idTipoVaga = objeto?.idTipoVaga ?? '';
  }

  toFirestore() {
    return {
      id: this.id,
      idEmpresa: this.idEmpresa,
      descricao: this.descricao,
      exigencias: this.exigencias,
      cargaHoraria: this.cargaHoraria,
      idTipoVaga: this.idTipoVaga,
    };
  }
}