export class Vaga {
  public id: string;
  public idEmpresa: string;
  public titulo: string;
  public descricao: string;
  public exigencias: string;
  public cargaHoraria: number;
  public temBolsa: boolean;
  public valorBolsa: number;
  public idTipoVaga: string;
  public idInstituicaoFoco: string;

  constructor(objeto?: Partial<Vaga>) {
    this.id = objeto?.id ?? '';
    this.idEmpresa = objeto?.idEmpresa ?? '';
    this.titulo = objeto?.titulo ?? '';
    this.descricao = objeto?.descricao ?? '';
    this.exigencias = objeto?.exigencias ?? '';
    this.cargaHoraria = objeto?.cargaHoraria ?? 0;
    this.temBolsa = objeto?.temBolsa ?? false;
    this.valorBolsa = objeto?.valorBolsa ?? 0;
    this.idTipoVaga = objeto?.idTipoVaga ?? '';
    this.idInstituicaoFoco = objeto?.idInstituicaoFoco ?? 'todos';
  }

  toFirestore() {
    return {
      id: this.id,
      idEmpresa: this.idEmpresa,
      titulo: this.titulo,
      descricao: this.descricao,
      exigencias: this.exigencias,
      cargaHoraria: this.cargaHoraria,
      temBolsa: this.temBolsa,
      valorBolsa: this.valorBolsa,
      idTipoVaga: this.idTipoVaga,
      idInstituicaoFoco: this.idInstituicaoFoco,
    };
  }
}
