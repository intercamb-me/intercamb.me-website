import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import cloneDeep from 'lodash-es/cloneDeep';

import {SearchAddressComponent} from '@components/company/client/search-address/search-address.component';

import {ClientService} from '@services/client.service';
import {TokenService} from '@services/token.service';
import {AlertService} from '@services/alert.service';
import {ErrorUtils} from '@utils/error.utils';
import {Constants} from '@utils/constants';
import {Helpers} from '@utils/helpers';
import {Address} from '@models/address.model';
import {Client} from '@models/client.model';
import {Institution} from '@models/institution.model';
import {Token} from '@models/token.model';

@Component({
  selector: 'app-client-form',
  templateUrl: './form.component.html',
})
export class ClientFormComponent implements OnInit {

  public token: Token;
  public photo: File;
  public photoSrc: string;
  public formData: any;
  public infoStep = 0;
  public todayDateStruct: NgbDateStruct;
  public phonePattern = Constants.PHONE_PATTERN;
  public phoneMask = Constants.PHONE_MASK;
  public cpfMask = Constants.CPF_MASK;
  public zipCodeMask = Constants.ZIP_CODE_MASK;
  public numberMask = Constants.NUMBER_MASK;
  public onlyDateChars = Helpers.onlyDateChars;
  public loading = true;
  public clientCreated = false;

  constructor(private clientService: ClientService, private tokenService: TokenService, private alertService: AlertService, private activatedRoute: ActivatedRoute, private router: Router, private ngbModal: NgbModal) {

  }

  public ngOnInit(): void {
    const tokenId = this.activatedRoute.snapshot.paramMap.get('token');
    this.tokenService.getToken(tokenId).subscribe((token) => {
      if (token.type !== Token.TYPE_CLIENT_FORM) {
        this.navigateToPageNotFound();
        return;
      }
      this.token = token;
      this.formData = this.getFormData();
      const now = new Date();
      this.todayDateStruct = {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate(),
      };
      this.loading = false;
    }, (err) => {
      if (err.code === ErrorUtils.TOKEN_NOT_FOUND) {
        this.navigateToPageNotFound();
      }
      this.alertService.apiError(null, err);
    });
  }

  public trackByInstitution(_index: number, institution: Institution): string {
    return institution.id;
  }

  public compareInstitutions(institution: Institution, otherInstitution: Institution): boolean {
    return institution && otherInstitution && institution.id === otherInstitution.id;
  }

  public nextInfoStep(): void {
    this.infoStep += 1;
  }

  public previousInfoStep(): void {
    this.infoStep = this.infoStep - 1;
  }

  public getDefaultPhotoUrl(): string {
    return 'https://cdn.intercamb.me/images/client_default_photo.png';
  }

  public searchAddress(): void {
    const modalRef = this.ngbModal.open(SearchAddressComponent, {
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.result.then((address: Address) => {
      this.formData.address.zip_code = address.zip_code;
      this.formData.address.state = address.state;
      this.formData.address.city = address.city;
      this.formData.address.neighborhood = address.neighborhood;
      this.formData.address.public_place = address.public_place;
    }).catch(() => {
      // Nothing to do...
    });
  }

  public updateClientPhoto(event: any): void {
    this.photo = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (readEvent: any) => {
      this.photoSrc = readEvent.target.result;
    };
    reader.readAsDataURL(this.photo);
  }

  public createClient(): void {
    const data = this.fixFormData();
    this.clientService.createClient(data, this.token).subscribe((client) => {
      this.clientCreated = true;
      if (this.photo) {
        this.clientService.updateClientPhoto(client, this.photo).subscribe(() => {
          // Nothing to do...
        }, () => {
          // Nothing to do...
        });
      }
    }, (err) => {
      this.alertService.apiError(null, err);
    });
  }

  private navigateToPageNotFound(): void {
    this.router.navigate(['/404'], {
      replaceUrl: false,
      skipLocationChange: true,
    });
  }

  private getFormData(): any {
    const client = new Client({});
    const data: any = {
      forename: client.forename,
      surname: client.surname,
      email: client.email,
      phone: client.phone,
      address: client.address,
      personal_data: client.personal_data,
      family_data: client.family_data,
      in_case_of_emergency: client.in_case_of_emergency,
      academic_data: client.academic_data,
      intended_course: client.intended_course,
      additional_information: client.additional_information,
    };
    if (data.address.number) {
      data.address.number = String(data.address.number);
    }
    if (data.academic_data.high_school.conclusion_year) {
      data.academic_data.high_school.conclusion_year = String(data.academic_data.high_school.conclusion_year);
    }
    if (data.academic_data.higher_education.conclusion_year) {
      data.academic_data.higher_education.conclusion_year = String(data.academic_data.higher_education.conclusion_year);
    }
    if (data.personal_data.birthdate) {
      const birthdate = data.personal_data.birthdate;
      data.personal_data.birthdate = {
        year: birthdate.getFullYear(),
        month: birthdate.getMonth() + 1,
        day: birthdate.getDate(),
      };
    }
    if (data.additional_information.arrival_date) {
      const arrivalDate = data.additional_information.arrival_date;
      data.additional_information.arrival_date = {
        year: arrivalDate.getFullYear(),
        month: arrivalDate.getMonth() + 1,
        day: arrivalDate.getDate(),
      };
    }
    return data;
  }

  private fixFormData(): any {
    const data = cloneDeep(this.formData);
    if (data.address.number) {
      data.address.number = Number(data.address.number);
    }
    if (data.academic_data.high_school.conclusion_year) {
      data.academic_data.high_school.conclusion_year = Number(data.academic_data.high_school.conclusion_year);
    }
    if (data.academic_data.higher_education.conclusion_year) {
      data.academic_data.higher_education.conclusion_year = Number(data.academic_data.higher_education.conclusion_year);
    }
    if (data.personal_data.birthdate) {
      const birthdate = new Date(data.personal_data.birthdate.year, data.personal_data.birthdate.month - 1, data.personal_data.birthdate.day);
      data.personal_data.birthdate = birthdate;
    }
    if (data.additional_information.arrival_date) {
      const arrivalDate = new Date(data.additional_information.arrival_date.year, data.additional_information.arrival_date.month - 1, data.additional_information.arrival_date.day);
      data.additional_information.arrival_date = arrivalDate;
    }
    return data;
  }
}
