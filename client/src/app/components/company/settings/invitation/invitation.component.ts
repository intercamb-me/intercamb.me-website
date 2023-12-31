import {Component} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import {InvitationService} from '@services/invitation.service';
import {AlertService} from '@services/alert.service';

@Component({
  selector: 'app-invitation',
  templateUrl: './invitation.component.html',
})
export class InvitationComponent {

  public email: string;
  public sending: boolean;

  constructor(private invitationService: InvitationService, private alertService: AlertService, private ngbActiveModal: NgbActiveModal) {

  }

  public close(): void {
    this.ngbActiveModal.dismiss();
  }

  public createInvitation(): void {
    this.sending = true;
    this.invitationService.createInvitation(this.email).subscribe(() => {
      this.ngbActiveModal.close();
      this.alertService.success('Convite enviado com sucesso!');
    }, (err) => {
      this.sending = false;
      this.alertService.apiError(null, err, 'Não foi possível enviar o convite, por favor tente novamente mais tarde!');
    });
  }
}
