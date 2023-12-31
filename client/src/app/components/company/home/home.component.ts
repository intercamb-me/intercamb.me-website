import {Component, OnInit} from '@angular/core';
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import {CalendarEvent, CalendarUtils as LibCalendarUtils} from 'angular-calendar';
import {GetMonthViewArgs, MonthView} from 'calendar-utils';
import {NgxMasonryOptions} from 'ngx-masonry';
import {forkJoin} from 'rxjs';
import * as startOfWeek from 'date-fns/start_of_week';
import * as addWeeks from 'date-fns/add_weeks';
import * as endOfWeek from 'date-fns/end_of_week';

import {CompanyService} from '@services/company.service';
import {AlertService} from '@services/alert.service';
import {CalendarUtils} from '@utils/calendar.utils';
import {Constants} from '@utils/constants';
import {Client} from '@models/client.model';
import {PaymentOrder} from '@models/payment-order.model';

export class CustomCalendarUtils extends LibCalendarUtils {

  public getMonthView(args: GetMonthViewArgs): MonthView {
    args.viewStart = startOfWeek(args.viewDate);
    args.viewEnd = endOfWeek(addWeeks(args.viewDate, 1));
    return super.getMonthView(args);
  }
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  providers: [
    {provide: LibCalendarUtils, useClass: CustomCalendarUtils},
  ],
})
export class HomeComponent implements OnInit {

  public clientsCount: number;
  public clientsToReview: Client[];
  public pendingPaymentOrders: PaymentOrder[];
  public overduePaymentOrders: PaymentOrder[];
  public calendarEvents: CalendarEvent[] = [];
  public calendarDate = new Date();
  public paymentMethods = Constants.PAYMENT_METHODS;
  public loading = true;

  public masonryOptions: NgxMasonryOptions = {
    itemSelector: '.col-6',
    horizontalOrder: true,
    transitionDuration: '0',
  };

  constructor(private companyService: CompanyService, private alertService: AlertService) {

  }

  public ngOnInit(): void {
    const startDate = startOfWeek(new Date());
    const endDate = endOfWeek(addWeeks(new Date(), 1));
    forkJoin([
      this.companyService.countClients(),
      this.companyService.listClientsToReview({limit: 6}),
      this.companyService.listScheduledTasks(startDate, endDate, {select: 'client.forename client.surname', populate: 'client'}),
      this.companyService.listPendingPaymentOrders({select: 'company.currency client.photo_url client.forename client.surname', populate: 'company client', limit: 6}),
      this.companyService.listOverduePaymentOrders({select: 'company.currency client.photo_url client.forename client.surname', populate: 'company client', limit: 6}),
    ]).subscribe((result) => {
      this.clientsCount = result[0];
      this.clientsToReview = result[1];
      this.calendarEvents = CalendarUtils.getCalendarMonthEvents(result[2]);
      this.pendingPaymentOrders = result[3];
      this.overduePaymentOrders = result[4];
      this.loading = false;
    }, (err) => {
      this.alertService.apiError(null, err);
    });
  }

  public trackByClient(_index: number, client: Client): string {
    return client.id;
  }

  public openEventGroupPopover(popover: NgbPopover, event: CalendarEvent): void {
    popover.popoverTitle = event.title;
    popover.open({event});
  }
}
