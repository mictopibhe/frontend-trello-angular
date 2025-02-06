import {Component, EventEmitter, Input, Output, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgIf, TitleCasePipe} from '@angular/common';

@Component({
  selector: 'app-modal-input',
  imports: [
    FormsModule,
    TitleCasePipe,
    NgIf
  ],
  templateUrl: './modal-input.component.html',
  styleUrl: './modal-input.component.scss'
})
export class ModalInputComponent {
  @Input() entityType = 'board';

  @Output() inputData = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();

  inputValue = signal<string>('');

  onSubmit() {
    this.inputData.emit(this.inputValue());
  }

  onClose() {
    this.close.emit();
  }
}
