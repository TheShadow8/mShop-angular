import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { Product } from './models/product';
import { take } from 'rxjs/operators';
import { ShoppingCart } from './models/shopping-cart';
import { ShoppingCartItem } from './models/shopping-cart-item';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  constructor(private db: AngularFireDatabase) {}

  async getCart(): Promise<Observable<ShoppingCart>> {
    let cardId = await this.getOrCreateCart();
    return this.db
      .object('/shopping-carts/' + cardId)
      .snapshotChanges()
      .pipe(map((x: any) => new ShoppingCart(x.payload.val().items)));
  }

  private getItem(
    cardId: string,
    productId: string
  ): AngularFireObject<ShoppingCartItem> {
    return this.db.object('/shopping-carts/' + cardId + '/items/' + productId);
  }

  private create() {
    return this.db.list('/shopping-carts').push({
      dateCreated: new Date().getTime()
    });
  }

  private async getOrCreateCart(): Promise<string> {
    let cardId = localStorage.getItem('cardId');

    if (cardId) return cardId;

    let res = await this.create();
    localStorage.setItem('cardId', res.key);
    return res.key;
  }

  private async updateItemQuantity(product: Product, change: number) {
    let cardId = await this.getOrCreateCart();
    let item$ = this.getItem(cardId, product.key);

    item$
      .snapshotChanges()
      .pipe(take(1))
      .subscribe(item => {
        item$.update({
          product: product,
          quantity:
            ((item.payload.val() && item.payload.val().quantity) || 0) + change
        });
      });
  }

  async addToCart(product: Product) {
    this.updateItemQuantity(product, 1);
  }

  async removeFromCart(product: Product) {
    this.updateItemQuantity(product, -1);
  }
}
