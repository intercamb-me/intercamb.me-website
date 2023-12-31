/* tslint:disable:variable-name */

export class InCaseOfEmergency {

  public responsible: string;
  public bond: string;
  public email: string;
  public phone: string;
  public alternative_phone: string;

  constructor(data?: any) {
    if (data) {
      this.responsible = data.responsible;
      this.bond = data.bond;
      this.email = data.email;
      this.phone = data.phone;
      this.alternative_phone = data.alternative_phone;
    }
  }
}
