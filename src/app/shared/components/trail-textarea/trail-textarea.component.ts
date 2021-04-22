import { Component, Input, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'app-trail-textarea',
  templateUrl: './trail-textarea.component.html',
  styleUrls: ['./trail-textarea.component.scss'],
})
export class TrailTextareaComponent implements ControlValueAccessor {
  @Input() placeholder = '';
  @Input() label: string;
  @Input() disabled: boolean | null = null;
  @Input() readonly: boolean | null = null;
  @Input() required: boolean | null = null;
  @Input() autocomplete: 'on' | 'off';
  @Input() tabindex: number;
  @Input() inputValue: string;

  @Input() fieldId: string | null = null;

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

  /**
   * Write form value to the DOM element (model => view)
   */
  writeValue(value: any): void {
    this.value = value;
    this.onChange(value);

    // if (value !== this._value) {
    //   this._value = value;
    // }
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
