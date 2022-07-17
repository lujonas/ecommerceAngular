import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];
  totalPrice: Subject<number> =new Subject<number>();
  totalQuantity: Subject<number> =new Subject<number>();      // subclass of Observable; used to publish events in code; the event will be sent to all of the subscribers

  constructor() { }

  addToCart(newCartItem: CartItem) {

    // check if item is already in cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem | undefined = this.cartItems.find(item => item.id === newCartItem.id);



    // increase quantity or add to the array
    if(alreadyExistsInCart) {
      existingCartItem.quantity++;
    } else {
      this.cartItems.push(newCartItem);
    }

    //compute cart total price and total quantity
    this.computeCartTotals();
  }


  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for(let currentItem of this.cartItems) {
      totalPriceValue += currentItem.quantity * currentItem.unitPrice;
      totalQuantityValue += currentItem.quantity;
    }

    //publish to subscribers to receive new values
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    // log cart data for debugging
    this.logCartData(totalPriceValue, totalQuantityValue);
  }
  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log(`Contents of the cart`);
    for(let cartItem of this.cartItems) {
      const subTotalPrice = cartItem.quantity * cartItem.unitPrice;
      console.log(`name: ${cartItem.name}, quantity: ${cartItem.quantity}, unitPrice: ${cartItem.unitPrice}, subTotalPrice: €${subTotalPrice}`);
    }

    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
    console.log('===');
  }

}
