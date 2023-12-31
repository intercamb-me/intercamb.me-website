/* tslint:disable:variable-name */

import {Account} from '@models/account.model';
import isObject from 'lodash-es/isObject';
import cloneDeep from 'lodash-es/cloneDeep';

export class TaskAttachment {

  public id: string;
  public account_id: string;
  public account: Account;
  public name: string;
  public type: string;
  public size: number;
  public url: string;
  public registration_date: Date;

  constructor(data?: any) {
    if (data) {
      this.id = data.id;
      this.name = data.name;
      this.type = data.type;
      this.size = data.size;
      this.url = data.url;
      this.registration_date = new Date(data.registration_date);
      if (isObject(data.account)) {
        this.account = new Account(data.account);
        this.account_id = this.account.id;
      } else {
        this.account_id = data.account;
      }
    }
  }

  public toJSON(): any {
    const json = cloneDeep(this) as any;
    json.account = json.account_id;
    delete json.account_id;
    return json;
  }
}
