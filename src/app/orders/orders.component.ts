import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { OrderService } from '../Shared/order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  orderList;

  constructor(private service:OrderService,
    private router:Router,
    private toaster: ToastrService) { }

  ngOnInit(){
    this.refreshList();
  }

  refreshList(){
    this.service.getOrderList().then(res=> this.orderList=res);
  }

  openForEdit(orderID:number){
    this.router.navigate(['/Order/edit/' + orderID]);
  }

  onOrderDelete(id:number){
    if(confirm("Are you Sure to delete this?")){
      this.service.deleteOrder(id).then(res=>{
        this.refreshList();
        this.toaster.warning("Delete Succesfully", "Restaurant App");
      });
    }
  }

}
