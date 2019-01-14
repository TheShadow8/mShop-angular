import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { CategoryService } from '../category.service';
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
  categories$;
  category: string;

  constructor(
    productService: ProductService,
    categoryService: CategoryService,
    route: ActivatedRoute
  ) {
    productService
      .getAll<Product>()
      .subscribe(
        products => (this.filteredProducts = this.products = products)
      );

    this.categories$ = categoryService.getAll();

    route.queryParamMap.subscribe(params => {
      this.category = params.get('category');

      this.filteredProducts = this.category
        ? this.products.filter(p => p.category == this.category)
        : this.products;
    });
  }
}
