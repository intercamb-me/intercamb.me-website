/* tslint:disable:variable-name */

export class Account {

  public id: string;
  public first_name: string;
  public last_name: string;
  public email: string;
  public image_url: string;
  public company: string;
  public registration_date: Date;

  constructor(data?: any) {
    if (data) {
      this.id = data.id;
      this.first_name = data.first_name;
      this.last_name = data.last_name;
      this.email = data.email;
      this.image_url = data.image_url;
      this.company = data.company;
      this.registration_date = new Date(data.registration_date);
    }
  }

  public getFullName(): string {
    return `${this.first_name} ${this.last_name}`;
  }
}
