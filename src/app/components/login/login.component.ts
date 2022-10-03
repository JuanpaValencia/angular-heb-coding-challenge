import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import { SubscriptionBag } from '../../helpers/subscription-bag';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  error: string;
  subsBag = new SubscriptionBag();

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private authenticationService: AuthService
  ) {
     // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
        this.router.navigate(['']);
    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnDestroy(): void {
    // get rid of subscriptions
    this.subsBag.dispose();
  }

// convenience getter for easy access to form fields
  get f(): any {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    // try to authenticate the user
    this.subsBag.add = this.authenticationService.login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
          data => {
              // navigate to main screen if login was successful
              this.router.navigate(['']);
          },
          error => {
              // set the error
              this.error = error;
              this.loading = false;
          }
      );
  }
}
