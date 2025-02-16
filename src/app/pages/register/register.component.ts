import {Component, inject, OnInit, signal} from '@angular/core';
import {AsyncPipe, NgClass} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CustomValidationService} from '../../services/custom-validation.service';
import {select, Store} from '@ngrx/store';
import {RegisterActions} from '../../store/actions/register.actions';
import {Observable} from 'rxjs';
import {isSubmittingSelector} from '../../store/selectors';

@Component({
  selector: 'app-register',
  imports: [
    NgClass,
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private validationService = inject(CustomValidationService);
  private store = inject(Store);

  form!: FormGroup;
  isSubmitting$!: Observable<boolean>;
  passwordComplexity = signal<number>(0);

  ngOnInit(): void {
    this.initializeForm();
    this.initializeValues();
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

  initializeValues() {
    this.isSubmitting$ = this.store.pipe(select(isSubmittingSelector));
  }

  trackPasswordChanges(): void {
    this.form.get('password')?.valueChanges.subscribe((newPassword) => {
      this.passwordComplexity.set(this.getPasswordComplexity(newPassword));
    });
  }

  onSubmit(): void {
    this.store.dispatch(
      RegisterActions.register({
        request: {
          email: this.form.get('email')!.value,
          password: this.form.get('password')!.value
        }
      })
    );
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
