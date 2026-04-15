import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
    selector: 'app-auth',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

    activeTab: 'login' | 'signup' = 'signup';

    loginForm!: FormGroup;
    signupForm!: FormGroup;

    loginLoading = false;
    signupLoading = false;
    loginMsg = '';
    loginMsgType = '';
    signupMsg = '';
    signupMsgType = '';

    showLoginPw = false;
    showSignupPw = false;
    showConfirmPw = false; // 

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        // Check for token in URL (from OAuth redirect)
        this.route.queryParams.subscribe(params => {
            const token = params['token'];
            if (token) {
                localStorage.setItem('token', token);
                this.router.navigate(['/dashboard']);
            }
        });

        if (this.authService.isLoggedIn()) {
            this.router.navigate(['/dashboard']);
        }

        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]]
        });

        // added confirmPassword + validator
        this.signupForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [
                Validators.required,
                Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{8,15}$/)
            ]],
            confirmPassword: ['', [Validators.required]]
        }, { validators: this.passwordMatchValidator });
    }

    // validator
    passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
        const password = form.get('password')?.value;
        const confirm = form.get('confirmPassword')?.value;

        return password === confirm ? null : { passwordMismatch: true };
    }

    switchTab(tab: 'login' | 'signup'): void {
        this.activeTab = tab;
        this.clearMessages();
    }

    clearMessages(): void {
        this.loginMsg = '';
        this.signupMsg = '';
    }

    get lf() { return this.loginForm.controls; }
    get sf() { return this.signupForm.controls; }

    onLogin(): void {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }

        this.loginLoading = true;
        this.loginMsg = '';

        this.authService.login(this.loginForm.value).subscribe({
            next: () => {
                this.loginMsg = '✓ Login successful! Redirecting...';
                this.loginMsgType = 'success';
                setTimeout(() => this.router.navigate(['/dashboard']), 700);
            },
            error: (err) => {
                this.loginMsg = err.error?.message || 'Invalid credentials. Please try again.';
                this.loginMsgType = 'error';
                this.loginLoading = false;
            }
        });
    }

    onSignup(): void {
        if (this.signupForm.invalid) {
            this.signupForm.markAllAsTouched();
            return;
        }

        this.signupLoading = true;
        this.signupMsg = '';

        // Provide a default mobile number for the backend requirement
        const payload = { ...this.signupForm.value, mobileNumber: '9999999999' };
        const { confirmPassword, ...registerData } = payload;

        this.authService.signup(registerData).subscribe({
            next: () => {
                this.signupMsg = '✓ Account created! Please login.';
                this.signupMsgType = 'success';
                this.signupForm.reset();
                this.signupLoading = false;
                setTimeout(() => this.switchTab('login'), 1200);
            },
            error: (err) => {
                this.signupMsg = err.error?.message || 'Signup failed. Email may already be registered.';
                this.signupMsgType = 'error';
                this.signupLoading = false;
            }
        });
    }
}