import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';

import { ItemService } from 'src/app/Shared/item.service';
import { OrderItem } from 'src/app/Shared/order-item.model';
import { Item } from 'src/app/Shared/item.model';
import { OrderService } from 'src/app/Shared/order.service';

@Component({
  selector: 'app-order-items',
  templateUrl: './order-items.component.html',
  styles: [
  ]
})
export class OrderItemsComponent implements OnInit {

  OIformData:OrderItem
  itemList:Item[];
  isValid:boolean=true;

  //MAT_DIALOG_DATA is a constant hence need to use as decorator in inject
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogref:MatDialogRef<OrderItemsComponent>,
    private itemService:ItemService,
    private orderServive:OrderService) { }
  

  ngOnInit(){
    this.itemService.getItemList().then(res=> this.itemList = res as Item[]);
    if(this.data.orderItemIndex == null){
      this.OIformData={
        OrderItemID:null,
        OrderID:this.data.OrderID,
        ItemID:0,
        ItemName:'',
        Price:0,
        Quantity:0,
        Total:0
      }
    }
    else{
      this.OIformData = Object.assign({}, this.orderServive.orderItems[this.data.orderItemIndex]);
    }
  }

  updatePrice(ctrl){
    if(ctrl.selectedIndex==0){
      this.OIformData.Price=0;
      this.OIformData.ItemName='';
    }
    else{
      this.OIformData.Price =this.itemList[ctrl.selectedIndex-1].Price;
      this.OIformData.ItemName =this.itemList[ctrl.selectedIndex-1].Name;
    }
    this.updateTotal();
  }

  updateTotal(){
    this.OIformData.Total= parseFloat((this.OIformData.Quantity * this.OIformData.Price).toFixed(2));
  }

  onSubmit(iForm:NgForm){
    if(this.validateForm(iForm.value)){
      if(this.data.orderItemIndex == null){
        this.orderServive.orderItems.push(iForm.value);
      }
      else{
        this.orderServive.orderItems[this.data.orderItemIndex] = iForm.value;
      }
    this.dialogref.close();
    }
  }
  validateForm(OIformData:OrderItem){
    this.isValid=true;
    if(OIformData.ItemID ==0)
      this.isValid=false;
      else if(OIformData.Quantity ==0)
      this.isValid=false;

      return this.isValid;
  }


}
