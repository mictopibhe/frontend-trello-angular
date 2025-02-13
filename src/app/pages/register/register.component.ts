import {Component, inject, OnInit, signal} from '@angular/core';
import {NgClass} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CustomValidationService} from '../../services/custom-validation.service';

@Component({
  selector: 'app-register',
  imports: [
    NgClass,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private validationService = inject(CustomValidationService);

  form!: FormGroup;
  passwordComplexity = signal<number>(0);

  ngOnInit(): void {
    this.initializeForm();
    this.trackPasswordChanges();
  }

  initializeForm() {
    this.form = this.formBuilder.group({
        email: ['', {
          nonNullable: true,
          validators: [Validators.required, Validators.email],
          updateOn: 'blur'
        }],
        password: ['', {
          validators: [
            Validators.required,
            Validators.minLength(8),
            this.validationService.passwordComplexityValidator()
          ],
          updateOn: 'change'
        }],
        confirmPassword:
          ['', Validators.required],
        updateOn: 'change'
      },
      {
        validators: [this.validationService.passwordMatchValidator()],
        updateOn: 'blur'
      }
    );
  }

  trackPasswordChanges(): void {
    this.form.get('password')?.valueChanges.subscribe((newPassword) => {
      this.passwordComplexity.set(this.getPasswordComplexity(newPassword));
    });
  }

  onSubmit(): void {
    console.log('submit', this.form.value, this.form.valid)
  }

  getComplexityClass(index: number): string {
    const complexityClasses = ['weak', 'medium', 'strong', 'very-strong'];
    return index < this.passwordComplexity() ? complexityClasses[this.passwordComplexity() - 1] : 'empty';
  }

  getPasswordComplexity(password: string): number {
    let complexity = 0;

    if (/[a-zа-я]/.test(password)) complexity++;
    if (password.length >= 8) {
      complexity++;
      if (/[A-ZА-Я]/.test(password)) complexity++;
      if (/\d/.test(password) || /[!@#$%^&*]/.test(password)) complexity++;
    }
    return complexity;
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  get confirmPassword() {
    return this.form.get('confirmPassword');
  }
}
