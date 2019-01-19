import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../product.service';

import { ActivatedRoute } from '@angular/router';
import { Product } from '../models/product';
import { ShoppingCartService } from '../shopping-cart.service';
import { Subscription, Observable } from 'rxjs';
import { ShoppingCart } from '../models/shopping-cart';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: any[] = [];
  cart$: Observable<ShoppingCart>;
  category: string;

  constructor(
    private productService: ProductService,
    private cartService: ShoppingCartService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.cart$ = await this.cartService.getCart();
    this.populateProducts();
  }

  private populateProducts() {
    this.productService
      .getAll<Product>()
      .subscribe(
        products => (this.filteredProducts = this.products = products)
      );

    this.route.queryParamMap.subscribe(params => {
      this.category = params.get('category');
      this.applyFilter();
    });
  }
  private applyFilter() {
    this.filteredProducts = this.category
      ? this.products.filter(p => p.category == this.category)
      : this.products;
  }
}
