import {Component, EventEmitter, Output} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-card-creation-form',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './card-creation-form.component.html',
  styleUrl: './card-creation-form.component.scss'
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

  @Output() cancelCreation = new EventEmitter<void>();
  @Output() cardCreated = new EventEmitter<{ title: string; description: string }>();

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
