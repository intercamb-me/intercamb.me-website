import {Injectable} from '@angular/core';
import {Subscription, Subject} from 'rxjs';

export interface Event {
  name: string;
  value: any;
}

@Injectable()
export class EventService {

  public static readonly EVENT_API_ERROR = 'api_error';
  public static readonly EVENT_ACCOUNT_CHANGED = 'account_changed';
  public static readonly EVENT_ACCOUNT_NAME_CHANGED = 'account_name_changed';
  public static readonly EVENT_ACCOUNT_ICON_CHANGED = 'account_icon_changed';
  public static readonly EVENT_COMPANY_NAME_CHANGED = 'company_name_changed';
  public static readonly EVENT_COMPANY_LOGO_CHANGED = 'company_logo_changed';

  private subjects = new Map<string, Subject<Event>>();

  public publish(event: string, value: any): void {
    const subject = this.subjects.get(event);
    if (subject) {
      subject.next({value, name: event});
    }
  }

  public subscribe(event: string, callback: (event: Event) => void): Subscription {
    let subject = this.subjects.get(event);
    if (!subject) {
      subject = new Subject<Event>();
      this.subjects.set(event, subject);
    }
    return subject.subscribe(callback);
  }
}
