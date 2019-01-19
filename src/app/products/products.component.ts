import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../product.service';

import { ActivatedRoute } from '@angular/router';
import { Product } from '../models/product';
import { ShoppingCartService } from '../shopping-cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: any[] = [];
  cart: any;
  category: string;
  subscription: Subscription;

  constructor(
    productService: ProductService,
    private cartService: ShoppingCartService,
    route: ActivatedRoute
  ) {
    productService
      .getAll<Product>()
      .subscribe(
        products => (this.filteredProducts = this.products = products)
      );

    route.queryParamMap.subscribe(params => {
      this.category = params.get('category');

      this.filteredProducts = this.category
        ? this.products.filter(p => p.category == this.category)
        : this.products;
    });
  }

  async ngOnInit() {
    (await this.cartService.getCart()).subscribe(cart => (this.cart = cart));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
