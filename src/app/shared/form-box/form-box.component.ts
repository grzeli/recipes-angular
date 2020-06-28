import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-form-box',
  templateUrl: './form-box.component.html',
  styleUrls: ['./form-box.component.scss']
})
export class FormBoxComponent implements OnInit, AfterViewInit {
  @Input() options: any;
  @Input() formControlNameValue: string;
  @Input() formGroup: FormGroup;
  @Input() formSubmitted: boolean;
  @Input() selectOptions: any[];
  @Input() focusOnInit: boolean;
  @Input() mask: string;
  @Input() removable: boolean;

  @Output() change: EventEmitter<string> = new EventEmitter<string>();
  @Output() onExtraBtnClick: EventEmitter<Object> = new EventEmitter<Object>();
  @Output() onInputChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() onClearInput: EventEmitter<void> = new EventEmitter<void>();
  @Output() delete = new EventEmitter<boolean>();

  tagCount: number;

  @ViewChild('fieldRef', {static: false}) fieldRef: ElementRef;


  constructor() { }

  ngOnInit() {
  }

  inputValueChange(event: string) {
    this.onInputChange.emit(event);
  }

  ngAfterViewInit(): void {
    if (this.focusOnInit) {
      this.focusField();
    }
  }

  focusField(): void {
    this.fieldRef.nativeElement.focus();
  }

  clearInput(control: FormControl): void {
    control.setValue(null);
    if (this.options.multiple) {
      if (this.formGroup.get(this.formControlNameValue).value) {
        this.tagCount = this.formGroup.get(this.formControlNameValue).value.length;
      } else {
        this.tagCount = 0;
      }
    }

    this.onClearInput.emit();
  }

}
