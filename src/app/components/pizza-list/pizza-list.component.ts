import { PizzaService } from '../../services/pizza/pizza.service';
import { PizzaParams } from './../../models/pizza-list.params';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { SubscriptionBag } from '../../helpers/subscription-bag';
import { FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2/dist/sweetalert2.js';


@Component({
  selector: 'app-pizza-list',
  templateUrl: './pizza-list.component.html',
  styleUrls: ['./pizza-list.component.css']
})
export class PizzaListComponent implements OnInit, OnDestroy {
  searchText = '';
  tableNumber: number;
  currentUser: any;
  pizzaList$: Observable<PizzaParams[]>;
  subsBag = new SubscriptionBag();
  refreshList$ = new BehaviorSubject<void>(null);
  form = new FormGroup({
    search: new FormControl('')
  });

  constructor(private pizzaService: PizzaService,
              private authService: AuthService,
              public dialog: MatDialog,
              private router: Router) {
                // get current session
                this.authService.currentUser.subscribe(x => this.currentUser = x);
              }

  ngOnInit(): void {
    this.pizzaList$ = this.refreshList$.pipe(
        switchMap(() => {
            return this.pizzaService.getPizzaList().pipe(
              tap((orders) => {
                // get the next available table number
                this.tableNumber = orders.map(order => order.Table_No).sort((a, b) => a - b)[orders.length - 1] + 1;
              })
            );
        }));
  }

  ngOnDestroy(): void {
    // get rid of subscriptions
    this.subsBag.dispose();
  }

  logout(): void {
    // log user out
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  deleteOrder(id: string): void {
    // delete pizza order by id
    this.subsBag.add = this.pizzaService.deletePizza(id).subscribe((x) => {
      // display success message if successful
      this.showWarningMessage(
        'Order Deleted',
        '',
        'warning',
        false,
      );
      // refresh pizza orders list
      this.refreshList$.next(null);
    });
  }

  openDialog(): void {
    // open dialog for creating a pizza order
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // build pizza order params
        const pizza: PizzaParams = {
          ...result,
          Table_No: this.tableNumber
        };
        // call api to make a pizza order
        this.subsBag.add = this.pizzaService.makePizza(pizza).subscribe((data) => {
          // display success message if successful
          this.showSuccessMessage(
            'Order Created',
            'Working on your pizza!',
            'success',
            false,
          );
          // refresh pizza list
          this.refreshList$.next(null);
        });
      }
    });
  }

  showSuccessMessage(
    title: string, message: string, icon = null,
    showCancelButton = true): void{
    return Swal.fire({
      title,
      text: message,
      icon,
      showCancelButton
    });
  }

  showWarningMessage(
    title: string, message: string, icon = null,
    showCancelButton = true): void{
    return Swal.fire({
      title,
      text: message,
      icon,
      showCancelButton
    });
 }
}

interface Options {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'pizza-form.html',
})
export class DialogOverviewExampleDialog {
  crusts: Options[] = [
    {value: 'normal-0', viewValue: 'NORMAL'},
    {value: 'thin-1', viewValue: 'THIN'},
    {value: 'thick-2', viewValue: 'THICK'},
  ];

  sizes: Options[] = [
    {value: 'small-0', viewValue: 'S'},
    {value: 'medium-1', viewValue: 'M'},
    {value: 'large-2', viewValue: 'L'},
  ];

  flavors: Options[] = [
    {value: 'cheese-0', viewValue: 'CHEESE'},
    {value: 'pepperoni-1', viewValue: 'PEPPERONI'},
    {value: 'bbqchicken-2', viewValue: 'BBQ CHICKEN'},
    {value: 'margherita-3', viewValue: 'MARGHERITA'},
    {value: 'meats-4', viewValue: 'MEATS'},
    {value: 'chickenfajita-5', viewValue: 'CHICKEN-FAJITA'},
    {value: 'beefnormal-6', viewValue: 'BEEF-NORMAL'},
  ];

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: PizzaParams) {}

  // close the dialog
  onNoClick(): void {
    this.dialogRef.close();
  }
}
