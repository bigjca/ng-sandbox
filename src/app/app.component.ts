import {Component, ElementRef, OnDestroy, QueryList, ViewChildren} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy{
  title = 'ng-sandbox';
  form: FormGroup;

  @ViewChildren('firstName') firstNameInputs: QueryList<ElementRef<HTMLInputElement>>;
  @ViewChildren('lastName') lastNameInputs: QueryList<ElementRef<HTMLInputElement>>;

  private destroy$ = new Subject();

  constructor(private readonly fb: FormBuilder) {
    this.form = fb.group({
      items: this.fb.array([])
    });
    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => this.onFormValueChanges(value));
  }

  onFormValueChanges(value): void {
    console.log('form value changed!');
  }

  addItem(): void {
    const itemGroup = this.fb.group({
      firstName: [],
      lastName: []
    });
    this.items.push(itemGroup);
    itemGroup.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => this.onItemGroupValueChange(value, itemGroup));
  }

  onItemGroupValueChange(value: any, itemGroup: FormGroup): void {
    const index = this.items.controls.indexOf(itemGroup);
    const firstName = itemGroup.get('firstName');
    const lastName = itemGroup.get('lastName');
    if (itemGroup.dirty && index === this.items.length - 1) {
      this.addItem();
    } else if (index > 0 && (!firstName.value)  && (!lastName.value) && itemGroup.dirty) {
      this.removeItem(index);
      this.focusFirstName(index + 1);
    }

    if (firstName.value && firstName.value.length === 3) {
      if (firstName.value === 'aaa') {
        lastName.setValue('bbb', {emitEvent: false});
      } else {
        this.focusLastName(index);
      }
    }
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  focusFirstName(index: number): void {
    this.firstNameInputs.toArray()[index].nativeElement.focus();
  }

  focusLastName(index: number): void {
    this.lastNameInputs.toArray()[index].nativeElement.focus();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  test(): void {
    this.items.get([0]).setValue({firstName: 'abc', lastName: 'abc'}, {emitEvent: false});
  }
}
