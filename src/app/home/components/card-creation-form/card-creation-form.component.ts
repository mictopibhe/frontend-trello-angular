import {ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';

@Component({
  selector: 'tr-card-creation-form',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './card-creation-form.component.html',
  styleUrl: './card-creation-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardCreationFormComponent {
  cardForm = new FormGroup({
    cardTitle: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(25),
      Validators.pattern('^(?!\\s*$)[0-9a-zA-Zа-яА-ЯіІїЇєЄ.,\\-_\'! ]+$')
    ]),
    cardDescription: new FormControl('')
  });
  @Output() cardCreated = new EventEmitter<{ title: string; description: string }>();
  @Output() cancelCreation = new EventEmitter<void>();

  onSubmit() {
    if (this.cardForm.valid) {
      const { cardTitle, cardDescription } = this.cardForm.value;
      this.cardCreated.emit({ title: cardTitle!, description: cardDescription! });
      this.cardForm.reset();
    }
  }

  onCancel() {
    this.cancelCreation.emit();
  }
}
