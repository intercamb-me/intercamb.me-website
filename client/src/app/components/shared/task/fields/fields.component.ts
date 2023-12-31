import {Component, Input, Output, EventEmitter} from '@angular/core';
import {FormBuilder, FormGroup, FormArray, Validators} from '@angular/forms';

import {Constants} from '@utils/constants';
import {TaskField} from '@models/task-field.model';

@Component({
  selector: 'app-task-fields',
  templateUrl: './fields.component.html',
})
export class TaskFieldsComponent {

  @Input()
  set fields(fields: TaskField[]) {
    this.formArray = this.formBuilder.array([]);
    fields.forEach((field) => {
      const fieldFormGroup = this.createFieldFormGroup(field);
      this.formArray.push(fieldFormGroup);
    });
    this.formArray.statusChanges.subscribe((status) => {
      if (this.formStatus !== status) {
        this.formStatus = status;
        this.statusChanges.emit(this.isFormValid());
      }
    });
    this.formArray.updateValueAndValidity();
  }

  @Input()
  public mode: string;
  @Output()
  public fieldsChanges = new EventEmitter<TaskField[]>();
  @Output()
  public statusChanges = new EventEmitter<boolean>();

  public formArray: FormArray;
  public formStatus: string;
  public fieldTypes = Object.values(Constants.TASK_FIELD_TYPES);

  constructor(private formBuilder: FormBuilder) {

  }

  public editFormGroup(formGroup: FormGroup): void {
    formGroup.get('editing').setValue(true);
  }

  public stopEditingFormGroup(formGroup: FormGroup): void {
    formGroup.get('editing').setValue(false);
    this.emitFieldsChanges();
  }

  public removeField(field: FormGroup): void {
    const index = this.formArray.controls.indexOf(field);
    if (index >= 0) {
      this.formArray.removeAt(index);
      this.emitFieldsChanges();
    }
  }

  private createFieldFormGroup(field: TaskField): FormGroup {
    return this.formBuilder.group({
      name: [field.name, Validators.required],
      type: [field.type, Validators.required],
      value: [field.value],
      editing: [false],
    });
  }

  private emitFieldsChanges(): void {
    if (this.isFormValid()) {
      const fields: TaskField[] = [];
      (this.formArray.value as any[]).forEach((field) => {
        fields.push(new TaskField(field));
      });
      this.fieldsChanges.emit(fields);
    }
  }

  private isFormValid(): boolean {
    return this.formStatus === 'VALID';
  }
}
