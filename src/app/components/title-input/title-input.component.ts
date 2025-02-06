import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule, NgModel} from '@angular/forms';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-title-input',
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './title-input.component.html',
  styleUrl: './title-input.component.scss'
})
export class TitleInputComponent {
  @Input() class: string = '';
  @Input() id: string = '';
  @Input() required: boolean = false;
  @Input() minlength: number | null = null;
  @Input() maxlength: number | null = null;
  @Input() pattern: string = '';
  @Input() value: string = '';
  @Input() name: string = '';

  @Output() valueChange = new EventEmitter<string>();

  onAction(input: NgModel) {
    if (input.valid) {
      this.valueChange.emit(this.value);
    }
  }
}
