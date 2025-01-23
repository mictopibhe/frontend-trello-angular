import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgIf, TitleCasePipe} from '@angular/common';
import {Subject} from 'rxjs';

@Component({
  selector: 'tr-input-form',
  imports: [
    FormsModule,
    NgIf,
    TitleCasePipe
  ],
  templateUrl: './modal-input.component.html',
  styleUrl: './modal-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalInputComponent {
  @Input() entityType: string = 'board';
  @Output() close = new EventEmitter<void>();
  @Output() inputData = new EventEmitter<string>();
  inputValue: string = '';

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    if (this.inputValue.trim()) {
      this.inputData.emit(this.inputValue);
    }
  }
}
