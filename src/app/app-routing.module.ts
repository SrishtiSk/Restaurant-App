import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderComponent } from './Orders/order/order.component';
import { OrdersComponent } from './orders/orders.component';

const routes: Routes = [
  {path:'', redirectTo:'Order', pathMatch:'full'},
  {path:'Orders', component:OrdersComponent},
  {path:'Order', children:[
    {path:'', component:OrderComponent},
    {path:'edit/:id', component:OrderComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
  