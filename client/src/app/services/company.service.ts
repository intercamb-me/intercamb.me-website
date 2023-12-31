import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {map, catchError} from 'rxjs/operators';

import {EventService} from '@services/event.service';
import {ApiError} from '@services/commons/api.error';
import {RequestUtils} from '@utils/request.utils';
import {Account} from '@models/account.model';
import {Company} from '@models/company.model';
import {Institution} from '@models/institution.model';
import {Client} from '@models/client.model';
import {PaymentOrder} from '@models/payment-order.model';
import {Plan} from '@models/plan.model';
import {Task} from '@models/task.model';

@Injectable()
export class CompanyService {

  constructor(private eventService: EventService, private httpClient: HttpClient) {

  }

  public listAllInstitutions(): Observable<Institution[]> {
    const httpUrl = RequestUtils.getApiUrl('/companies/institutions');
    return this.httpClient.get<Institution[]>(httpUrl, RequestUtils.getJsonOptions()).pipe(
      map((institutionsData: Institution[]) => {
        const institutions: Institution[] = [];
        institutionsData.forEach((institutionData) => {
          institutions.push(new Institution(institutionData));
        });
        return institutions;
      }),
      catchError((err: HttpErrorResponse) => {
        const apiError = ApiError.withResponse(err);
        this.eventService.publish(EventService.EVENT_API_ERROR, apiError);
        return throwError(apiError);
      })
    );
  }

  public createCompany(data: any): Observable<Company> {
    const httpUrl = RequestUtils.getApiUrl('/companies');
    return this.httpClient.post<Company>(httpUrl, data, RequestUtils.getJsonOptions()).pipe(
      map((companyData: Company) => new Company(companyData)),
      catchError((err: HttpErrorResponse) => {
        const apiError = ApiError.withResponse(err);
        this.eventService.publish(EventService.EVENT_API_ERROR, apiError);
        return throwError(apiError);
      })
    );
  }

  public getCompany(options?: any): Observable<Company> {
    const httpUrl = RequestUtils.getApiUrl('/companies/current');
    const httpOptions = RequestUtils.getJsonOptions();
    let params = new HttpParams();
    params = RequestUtils.fillOptionsParams(params, options);
    httpOptions.params = params;
    return this.httpClient.get<Company>(httpUrl, httpOptions).pipe(
      map((companyData: Company) => companyData ? new Company(companyData) : null),
      catchError((err: HttpErrorResponse) => {
        const apiError = ApiError.withResponse(err);
        this.eventService.publish(EventService.EVENT_API_ERROR, apiError);
        return throwError(apiError);
      })
    );
  }

  public updateCompany(data: any): Observable<Company> {
    const httpUrl = RequestUtils.getApiUrl('/companies/current');
    return this.httpClient.put<Company>(httpUrl, data, RequestUtils.getJsonOptions()).pipe(
      map((companyData: Company) => new Company(companyData)),
      catchError((err: HttpErrorResponse) => {
        const apiError = ApiError.withResponse(err);
        this.eventService.publish(EventService.EVENT_API_ERROR, apiError);
        return throwError(apiError);
      })
    );
  }

  public updateCompanyLogo(logo: File): Observable<Company> {
    const httpUrl = RequestUtils.getApiUrl('/companies/current/logo');
    const formData = new FormData();
    formData.append('logo', logo);
    return this.httpClient.put<Company>(httpUrl, formData, RequestUtils.getOptions()).pipe(
      map((companyData: Company) => new Company(companyData)),
      catchError((err: HttpErrorResponse) => {
        const apiError = ApiError.withResponse(err);
        this.eventService.publish(EventService.EVENT_API_ERROR, apiError);
        return throwError(apiError);
      })
    );
  }

  public removeAccount(account: Account): Observable<void> {
    const httpUrl = RequestUtils.getApiUrl(`/companies/current/accounts/${account.id}`);
    return this.httpClient.delete<void>(httpUrl, RequestUtils.getJsonOptions()).pipe(
      map(() => null),
      catchError((err: HttpErrorResponse) => {
        const apiError = ApiError.withResponse(err);
        this.eventService.publish(EventService.EVENT_API_ERROR, apiError);
        return throwError(apiError);
      })
    );
  }

  public listPlans(options?: any): Observable<Plan[]> {
    const httpUrl = RequestUtils.getApiUrl('/companies/current/plans');
    const httpOptions = RequestUtils.getJsonOptions();
    let params = new HttpParams();
    params = RequestUtils.fillOptionsParams(params, options);
    httpOptions.params = params;
    return this.httpClient.get<Plan[]>(httpUrl, httpOptions).pipe(
      map((plansData: Plan[]) => {
        const plans: Plan[] = [];
        plansData.forEach((planData: any) => {
          plans.push(new Plan(planData));
        });
        return plans;
      }),
      catchError((err: HttpErrorResponse) => {
        const apiError = ApiError.withResponse(err);
        this.eventService.publish(EventService.EVENT_API_ERROR, apiError);
        return throwError(apiError);
      })
    );
  }

  public listClients(ids?: string[], options?: any): Observable<Client[]> {
    const httpUrl = RequestUtils.getApiUrl('/companies/current/clients');
    const httpOptions = RequestUtils.getJsonOptions();
    let params = new HttpParams();
    if (ids) {
      ids.forEach((id) => {
        params = params.append('id', id);
      });
    }
    params = RequestUtils.fillOptionsParams(params, options);
    httpOptions.params = params;
    return this.httpClient.get<Client[]>(httpUrl, httpOptions).pipe(
      map((clientsData: Client[]) => {
        const clients: Client[] = [];
        clientsData.forEach((clientData) => {
          clients.push(new Client(clientData));
        });
        return clients;
      }),
      catchError((err: HttpErrorResponse) => {
        const apiError = ApiError.withResponse(err);
        this.eventService.publish(EventService.EVENT_API_ERROR, apiError);
        return throwError(apiError);
      })
    );
  }

  public listClientsToReview(options?: any): Observable<Client[]> {
    const httpUrl = RequestUtils.getApiUrl('/companies/current/clients/review');
    const httpOptions = RequestUtils.getJsonOptions();
    let params = new HttpParams();
    params = RequestUtils.fillOptionsParams(params, options);
    httpOptions.params = params;
    return this.httpClient.get<Client[]>(httpUrl, httpOptions).pipe(
      map((clientsData: Client[]) => {
        const clients: Client[] = [];
        clientsData.forEach((clientData) => {
          clients.push(new Client(clientData));
        });
        return clients;
      }),
      catchError((err: HttpErrorResponse) => {
        const apiError = ApiError.withResponse(err);
        this.eventService.publish(EventService.EVENT_API_ERROR, apiError);
        return throwError(apiError);
      })
    );
  }

  public searchClients(search: string, options?: any): Observable<Client[]> {
    const httpUrl = RequestUtils.getApiUrl('/companies/current/clients');
    const httpOptions = RequestUtils.getJsonOptions();
    let params = new HttpParams();
    params = params.set('search', search);
    params = RequestUtils.fillOptionsParams(params, options);
    httpOptions.params = params;
    return this.httpClient.get<Client[]>(httpUrl, httpOptions).pipe(
      map((clientsData: Client[]) => {
        const clients: Client[] = [];
        clientsData.forEach((clientData) => {
          clients.push(new Client(clientData));
        });
        return clients;
      }),
      catchError((err: HttpErrorResponse) => {
        const apiError = ApiError.withResponse(err);
        this.eventService.publish(EventService.EVENT_API_ERROR, apiError);
        return throwError(apiError);
      })
    );
  }

  public countClients(): Observable<number> {
    const httpUrl = RequestUtils.getApiUrl('/companies/current/clients/count');
    return this.httpClient.get<number>(httpUrl, RequestUtils.getJsonOptions()).pipe(
      map((countData: any) => {
        return countData.count;
      }),
      catchError((err: HttpErrorResponse) => {
        const apiError = ApiError.withResponse(err);
        this.eventService.publish(EventService.EVENT_API_ERROR, apiError);
        return throwError(apiError);
      })
    );
  }

  public listScheduledTasks(startDate: Date, endDate: Date, options?: any): Observable<Task[]> {
    const httpUrl = RequestUtils.getApiUrl('/companies/current/tasks/scheduled');
    const httpOptions = RequestUtils.getJsonOptions();
    let params = new HttpParams();
    params = params.set('start_time', String(startDate.getTime()));
    params = params.set('end_time', String(endDate.getTime()));
    params = RequestUtils.fillOptionsParams(params, options);
    httpOptions.params = params;
    return this.httpClient.get<Task[]>(httpUrl, httpOptions).pipe(
      map((tasksData: Task[]) => {
        const tasks: Task[] = [];
        tasksData.forEach((taskData: any) => {
          tasks.push(new Task(taskData));
        });
        return tasks;
      }),
      catchError((err: HttpErrorResponse) => {
        const apiError = ApiError.withResponse(err);
        this.eventService.publish(EventService.EVENT_API_ERROR, apiError);
        return throwError(apiError);
      })
    );
  }

  public listPendingPaymentOrders(options?: any): Observable<PaymentOrder[]> {
    const httpUrl = RequestUtils.getApiUrl('/companies/current/payment_orders/pending');
    const httpOptions = RequestUtils.getJsonOptions();
    let params = new HttpParams();
    params = RequestUtils.fillOptionsParams(params, options);
    httpOptions.params = params;
    return this.httpClient.get<PaymentOrder[]>(httpUrl, httpOptions).pipe(
      map((paymentOrdersData: PaymentOrder[]) => {
        const paymentOrders: PaymentOrder[] = [];
        paymentOrdersData.forEach((paymentOrderData: any) => {
          paymentOrders.push(new PaymentOrder(paymentOrderData));
        });
        return paymentOrders;
      }),
      catchError((err: HttpErrorResponse) => {
        const apiError = ApiError.withResponse(err);
        this.eventService.publish(EventService.EVENT_API_ERROR, apiError);
        return throwError(apiError);
      })
    );
  }

  public listOverduePaymentOrders(options?: any): Observable<PaymentOrder[]> {
    const httpUrl = RequestUtils.getApiUrl('/companies/current/payment_orders/overdue');
    const httpOptions = RequestUtils.getJsonOptions();
    let params = new HttpParams();
    params = RequestUtils.fillOptionsParams(params, options);
    httpOptions.params = params;
    return this.httpClient.get<PaymentOrder[]>(httpUrl, httpOptions).pipe(
      map((paymentOrdersData: PaymentOrder[]) => {
        const paymentOrders: PaymentOrder[] = [];
        paymentOrdersData.forEach((paymentOrderData: any) => {
          paymentOrders.push(new PaymentOrder(paymentOrderData));
        });
        return paymentOrders;
      }),
      catchError((err: HttpErrorResponse) => {
        const apiError = ApiError.withResponse(err);
        this.eventService.publish(EventService.EVENT_API_ERROR, apiError);
        return throwError(apiError);
      })
    );
  }
  public getClientsPerMonthReport(): Observable<any> {
    const httpUrl = RequestUtils.getApiUrl('/companies/current/reports/clients_per_month');
    return this.httpClient.get<any>(httpUrl, RequestUtils.getJsonOptions()).pipe(
      catchError((err: HttpErrorResponse) => {
        const apiError = ApiError.withResponse(err);
        this.eventService.publish(EventService.EVENT_API_ERROR, apiError);
        return throwError(apiError);
      })
    );
  }

  public getClientsPerPlanReport(): Observable<any> {
    const httpUrl = RequestUtils.getApiUrl('/companies/current/reports/clients_per_plan');
    return this.httpClient.get<any>(httpUrl, RequestUtils.getJsonOptions()).pipe(
      catchError((err: HttpErrorResponse) => {
        const apiError = ApiError.withResponse(err);
        this.eventService.publish(EventService.EVENT_API_ERROR, apiError);
        return throwError(apiError);
      })
    );
  }

  public getBillingPerMonthReport(): Observable<any> {
    const httpUrl = RequestUtils.getApiUrl('/companies/current/reports/billing_per_month');
    return this.httpClient.get<any>(httpUrl, RequestUtils.getJsonOptions()).pipe(
      catchError((err: HttpErrorResponse) => {
        const apiError = ApiError.withResponse(err);
        this.eventService.publish(EventService.EVENT_API_ERROR, apiError);
        return throwError(apiError);
      })
    );
  }
}
