export class Endereco {
  public cep: string;
  public rua: string;
  public numero: string;
  public complemento: string;
  public bairro: string;
  public cidade: string;
  public estado: string;

  constructor(objeto?: Partial<Endereco>) {
    this.cep = objeto?.cep ?? '';
    this.rua = objeto?.rua ?? '';
    this.numero = objeto?.numero ?? '';
    this.complemento = objeto?.complemento ?? '';
    this.bairro = objeto?.bairro ?? '';
    this.cidade = objeto?.cidade ?? '';
    this.estado = objeto?.estado ?? '';
  }

  toFirestore() {
    return {
      cep: this.cep,
      rua: this.rua,
      numero: this.numero,
      complemento: this.complemento,
      bairro: this.bairro,
      cidade: this.cidade,
      estado: this.estado,
    };
  }
}