import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';

import { ActivatedRoute } from '@angular/router';
import { Product } from '../models/product';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {
  products: Product[] = [];
  filteredProducts: any[] = [];

  category: string;

  constructor(productService: ProductService, route: ActivatedRoute) {
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
}
