import {Component, OnInit} from '@angular/core';

import {AccountService} from '@services/account.service';
import {AlertService} from '@services/alert.service';
import {EventService} from '@services/event.service';
import {Account} from '@models/account.model';

@Component({
  selector: 'app-account-settings',
  templateUrl: './settings.component.html',
})
export class AccountSettingsComponent implements OnInit {

  public account: Account;
  public loading = true;
  public saving = false;

  constructor(private accountService: AccountService, private alertService: AlertService, private eventService: EventService) {

  }

  public ngOnInit(): void {
    this.accountService.getAccount().subscribe((account) => {
      this.account = account;
      this.loading = false;
    }, (err) => {
      this.alertService.apiError(null, err);
    });
  }

  public updateAccount(): void {
    this.saving = true;
    const data = {
      first_name: this.account.first_name,
      last_name: this.account.last_name,
      email: this.account.email,
    };
    this.accountService.updateAccount(data).subscribe((account) => {
      this.account = account;
      this.saving = false;
      this.eventService.publish(EventService.EVENT_ACCOUNT_CHANGED, account);
      this.alertService.success('Configurações atualizadas com sucesso!');
    }, (err) => {
      this.saving = false;
      this.alertService.apiError(null, err, 'Não foi possível atualizar as configurações, por favor tente novamente mais tarde!');
    });
  }

  public updateAccountImage(event: any): void {
    this.saving = true;
    const file = event.target.files[0];
    this.accountService.updateAccountImage(file).subscribe((account) => {
      this.account = account;
      this.saving = false;
      this.eventService.publish(EventService.EVENT_ACCOUNT_CHANGED, account);
      this.alertService.success('Imagem atualizada com sucesso!');
    }, (err) => {
      this.saving = false;
      this.alertService.apiError(null, err, 'Não foi possível atualizar a imagem, por favor tente novamente mais tarde!');
    });
  }
}
