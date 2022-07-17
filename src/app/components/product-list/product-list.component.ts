import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/service/cart.service';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  currentCategoryName: string = 'Books';
  searchMode: boolean = false;

  previousKeyword: string = "";

  // properties for pagination
  pageNumber: number = 1;
  pageSize: number = 10;
  totalElements: number = 0;
  

  constructor(private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    })
    this.listProducts();
  }

  listProducts() {

    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }

  };

  handleSearchProducts() {
    const keyword: string = this.route.snapshot.paramMap.get('keyword')!;

    // if we have a diffrenet keyword than privous then set pageNumber to 1
    if(this.previousKeyword != keyword) {
      this.pageNumber = 1;
    }

    this.previousKeyword = keyword;
    console.log(`keyword=${keyword}, pageNumber=${this.pageNumber}`)
    

    // search for the products using keyword
    this.productService.searchProductsPaginate(this.pageNumber -1, this.pageSize, keyword).subscribe(this.processResult());
  }


  handleListProducts() {
    //check if "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      // get "id" param string and convert to a number using the "+" symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;

      // get the "name" param string
      this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;
    } 

    // check if we have a differen category than previous
    // Note: Angular will reause a component if it's currently being viewed

    // if we have a diffrent category id than previous then set the pageNumber back to 1
    if(this.previousCategoryId != this.currentCategoryId) {
      this.pageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;
    console.log(`currentCategoryId=${this.currentCategoryId}, pageNumber=${this.pageNumber}`)

    // get the products for the given category id
    // pageNumber - 1 => angular starts with 1, spring with 0
    this.productService.getProductListPaginate(this.pageNumber - 1, this.pageSize, this.currentCategoryId).subscribe(this.processResult());
    
  }

  processResult() {
    return (data: any) => {
      this.products = data._embedded.products;
      this.pageNumber = data.page.number + 1;
      this.pageSize = data.page.size;
      this.totalElements = data.page.totalElements;
    };
  }

  updatePageSize(pageSizeEvent: Event) {
    this.pageSize = +(pageSizeEvent.target as HTMLInputElement).value;
    this.pageNumber = 1;
    this.listProducts();
  }

  addToCard(product: Product) {
    console.log(`Adding to cart: ${product.name}, ${product.unitPrice}`)

    //const cartItem = new CartItem(product);
    this.cartService.addToCart(new CartItem(product));
  }




}
