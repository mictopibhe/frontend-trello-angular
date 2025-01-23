import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgIf} from '@angular/common';

@Component({
  selector: 'tr-title-input',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgIf
  ],
  templateUrl: './title-input.component.html',
  styleUrl: './title-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
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

  onAction() {
    this.valueChange.emit(this.value);
  }
}
