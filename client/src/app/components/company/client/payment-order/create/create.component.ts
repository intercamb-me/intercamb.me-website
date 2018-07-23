import {Component, OnInit, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap/modal/modal.module';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker.module';
import {mergeMap} from 'rxjs/operators';
import {of} from 'rxjs';
import * as addMonths from 'date-fns/add_months';

import {CompanyService} from 'app/services/company.service';
import {PlanService} from 'app/services/plan.service';
import {ClientService} from 'app/services/client.service';
import {AlertService} from 'app/services/alert.service';
import {Constants} from 'app/utils/constants';
import {DateUtils} from 'app/utils/date.utils';
import {onlyDateChars} from 'app/utils/helpers';
import {Company} from 'app/models/company.model';
import {Plan} from 'app/models/plan.model';
import {Client} from 'app/models/client.model';

interface Split {
  amount: number;
  dueDateStruct: NgbDateStruct;
}

@Component({
  selector: 'app-create-payment-order',
  templateUrl: './create.component.html',
})
export class CreatePaymentOrderComponent implements OnInit {

  @Input()
  public client: Client;

  public company: Company;
  public method: string;
  public amount: number;
  public numberOfSplits = 1;
  public splits: Split[] = [];
  public dueDateStruct: NgbDateStruct;
  public availableMethods = Constants.PAYMENT_METHODS;
  public onlyDateChars = onlyDateChars;
  public loading = true;

  constructor(private companyService: CompanyService, private planService: PlanService, private clientService: ClientService, private alertService: AlertService, private ngbActiveModal: NgbActiveModal) {

  }

  public ngOnInit(): void {
    this.companyService.getCompany().pipe(
      mergeMap((company) => {
        this.company = company;
        return this.client.plan ? this.planService.getPlan(this.client.plan) : of(null);
      })
    ).subscribe((plan: Plan) => {
      if (plan) {
        this.amount = plan.price;
      }
      this.loading = false;
    }, (err) => {
      this.alertService.apiError(null, err);
    });
  }

  public trackByIndex(index: number): number {
    return index;
  }

  public onSplitChange(): void {
    if (this.amount) {
      this.splits = [];
      const splitAmount = Math.round((Number(this.amount) / this.numberOfSplits) * 100) / 100;
      const splitBaseDate = this.dueDateStruct ? DateUtils.fromDateStruct(this.dueDateStruct) : null;
      for (let i = 0; i < this.numberOfSplits; i += 1) {
        const splitDate = splitBaseDate ? addMonths(splitBaseDate, i) : null;
        this.splits.push({
          amount: splitAmount,
          dueDateStruct: DateUtils.toDateStruct(splitDate),
        });
      }
    }
  }

  public close(): void {
    this.ngbActiveModal.dismiss();
  }

  public selectMethod(method: string): void {
    this.method = method;
  }

  public createPaymentOrder(): void {
    const data: any[] = [];
    this.splits.forEach((split) => {
      data.push({
        method: this.method,
        amount: split.amount,
        due_date: DateUtils.toDateOnly(DateUtils.fromDateStruct(split.dueDateStruct)),
      });
    });
    this.clientService.createPaymentOrders(this.client, data).subscribe((paymentOrders) => {
      this.ngbActiveModal.close(paymentOrders);
      this.alertService.success('Ordens de pagamento adicionadas com sucesso!');
    }, (err) => {
      this.alertService.apiError(null, err, 'Não foi possível adicionar as ordens de pagament, por favor tente novamente mais tarde!');
    });
  }
}