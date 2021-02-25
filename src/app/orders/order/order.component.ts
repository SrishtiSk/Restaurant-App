import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { OrderService } from 'src/app/Shared/order.service';
import { OrderItemsComponent } from '../order-items/order-items.component';
import { CustomerService } from 'src/app/Shared/customer.service';
import { Customer } from 'src/app/Shared/customer.model';
import { ActivatedRoute, Router } from '@angular/router';



@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styles: [
  ]
})
export class OrderComponent implements OnInit {

  customerList:Customer[];
  isValid:boolean=true;

  constructor(public service:OrderService,
    private dialog:MatDialog,
    private customerService:CustomerService,
    private toaster:ToastrService,
    private router:Router,
    private currentRoute:ActivatedRoute) { }

  ngOnInit(){
    
    let orderID=this.currentRoute.snapshot.paramMap.get('id');
    if(orderID==null)
      this.resetForm();
    else{
      this.service.getOrderByID(parseInt(orderID)).then(res=>{
         this.service.formData = res.order;
         this.service.orderItems = res.orderDetails;
      })
    }

    //this.resetForm();
    this.customerService.getCustomerList().then(res=>this.customerList =res as Customer[]);
    

  }

  resetForm(form?:NgForm){
    if(form = null)
      form.resetForm();
    this.service.formData={
      OrderID:null,
      OrderNo:Math.floor(100000+Math.random()*900000).toString(),
      CustomerID:0,
      PayMethod:'',
      GrandTotal:0,
      DeletedOrderItemIDs:''
      
    };
    this.service.orderItems=[];
  }

  AddorEditOrderItem(orderItemIndex, OrderID){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.autoFocus=true; //foccus on the 1st element as soon as it opens
    dialogConfig.disableClose=true; ///prevents the closing of popu when clicked outside
    dialogConfig.width="50%";
    dialogConfig.data= {orderItemIndex, OrderID}; //property is sent as new obj suing {}
    this.dialog.open(OrderItemsComponent, dialogConfig).afterClosed().subscribe(
      res=>{
        this.updateGrandTotal();
      }
    );

  }

  onDeleteOrderItem(orderItemID:number, i:number){
    if(orderItemID != null){
      this.service.formData.DeletedOrderItemIDs += orderItemID +",";
    }
    this.service.orderItems.splice(i,1);
    this.updateGrandTotal();
  }

  updateGrandTotal(){
    this.service.formData.GrandTotal =this.service.orderItems.reduce((prev,curr)=>{
      return prev+curr.Total;
    }, 0);
    this.service.formData.GrandTotal= parseFloat((this.service.formData.GrandTotal).toFixed(2));

  }

  validateForm(){
    this.isValid=true;
    if(this.service.formData.CustomerID==0){
      this.isValid=false;
    }
    else if(this.service.orderItems.length==0)
      this.isValid=false;

    return this.isValid;
  }

  onSubmit(form:NgForm){
    if(this.validateForm()){
      this.service.saveOrUpdateOrder().subscribe(res=>{
        this.resetForm();
        this.toaster.success('Submitted Successfully', 'Restaurant App');
        this.router.navigate(['/Orders']);
        console.log("navigate to Orders");
        
      })
    }
  }
}
