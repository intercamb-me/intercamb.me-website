import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {mergeMap} from 'rxjs/operators';

import {AccountService} from 'app/services/account.service';
import {AlertService} from 'app/services/alert.service';
import {EventService} from 'app/services/event.service';
import {ErrorUtils} from 'app/utils/error.utils';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
})
export class SignUpComponent implements OnInit {

  public firstName: string;
  public lastName: string;
  public email: string;
  public password: string;
  public loading = true;

  private invitation: string;

  constructor(private accountService: AccountService, private eventService: EventService, private alertService: AlertService, private activatedRoute: ActivatedRoute, private router: Router) {

  }

  public ngOnInit(): void {
    this.invitation = this.activatedRoute.snapshot.queryParamMap.get('invitation');
    this.accountService.getAccount().subscribe((account) => {
      if (account && account.company) {
        this.router.navigate(['/company']);
        return;
      }
      if (account) {
        this.router.navigate(['/company', 'setup']);
        return;
      }
      this.loading = false;
    }, (err) => {
      this.alertService.apiError(null, err);
    });
  }

  public signUp(): void {
    this.accountService.createAccount(this.firstName, this.lastName, this.email, this.password, this.invitation).pipe(
      mergeMap(() => {
        return this.accountService.login(this.email, this.password);
      })
    ).subscribe((account) => {
      this.eventService.publish(EventService.EVENT_ACCOUNT_CHANGED, account);
      if (account.company) {
        this.router.navigate(['/company']);
      } else {
        this.router.navigate(['/company', 'setup']);
      }
    }, (err) => {
      this.alertService.apiError(ErrorUtils.CONTEXT_AUTHENTICATION, err);
    });
  }
}
