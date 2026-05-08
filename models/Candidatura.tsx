import { Estudante } from './Estudante';
import { Vaga } from './Vaga';

export type StatusCandidatura = 'pendente' | 'em-analise' | 'aprovado' | 'recusado';

export class Candidatura {
  public id: string;
  public candidato: Estudante;
  public vaga: Vaga;
  public status: StatusCandidatura;
  public createdAt: Date;

  constructor(objeto?: Partial<Candidatura>) {
    this.id = objeto?.id ?? '';
    this.candidato = objeto?.candidato
      ? new Estudante(objeto.candidato)
      : new Estudante();
    this.vaga = objeto?.vaga ? new Vaga(objeto.vaga) : new Vaga();
    this.status = objeto?.status ?? 'pendente';
    this.createdAt = objeto?.createdAt ?? new Date();
  }

  toFirestore() {
    return {
      id: this.id,
      idCandidato: this.candidato.id,
      candidato: {
        ...this.candidato.toFirestoreBase(),
        ...this.candidato.toFirestoreEspecifico(),
      },
      idVaga: this.vaga.id,
      vaga: this.vaga.toFirestore(),
      status: this.status,
      createdAt: this.createdAt,
    };
  }
}
