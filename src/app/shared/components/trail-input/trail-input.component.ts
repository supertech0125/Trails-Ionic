import {
  Component,
  Input,
  OnInit,
  Optional,
  Self,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'app-trail-input',
  templateUrl: './trail-input.component.html',
  styleUrls: ['./trail-input.component.scss'],
})
export class TrailInputComponent implements OnInit, ControlValueAccessor {
  // tslint:disable-next-line: no-bitwise
  @Input() type:
    | 'text'
    | 'password'
    | 'email'
    | 'number'
    | 'search'
    | 'tel'
    | 'url';
  @Input() placeholder = '';
  @Input() label: string;
  @Input() disabled: boolean | null = null;
  @Input() readonly: boolean | null = null;
  @Input() required: boolean | null = null;
  @Input() autocomplete: 'on' | 'off';
  @Input() tabindex: number;

  @Input() fieldId: string | null = null;

  @Input() inputValue: any = '';
  @Input() iconName: string | null = null;

  value: any = '';

  constructor(
    @Self()
    @Optional()
    private ngControl: NgControl
  ) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit(): void {}

  /**
   * Write form value to the DOM element (model => view)
   */
  writeValue(value: any): void {
    this.value = value;
  }

  /**
   * Write form disabled state to the DOM element (model => view)
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /**
   * Write form readonly state to the DOM element (model => view)
   */
  setReadOnlyState(isReadOnly: boolean): void {
    this.readonly = isReadOnly;
  }

  /**
   * Update form when DOM element value changes (view => model)
   */
  registerOnChange(fn: any): void {
    // Store the provided function as an internal method.
    this.onChange = fn;
  }

  /**
   * Update form when DOM element is blurred (view => model)
   */
  registerOnTouched(fn: any): void {
    // Store the provided function as an internal method.
    this.onTouched = fn;
  }

  onChange(ev?: any) {}
  onTouched(ev?: any) {}
}
