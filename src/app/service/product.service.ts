import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  //private baseUrl='https://ecommerce-spring-ludojo-dev.apps.sandbox-m2.ll9k.p1.openshiftapps.com/api/products';
  //private categoryUrl= 'https://ecommerce-spring-ludojo-dev.apps.sandbox-m2.ll9k.p1.openshiftapps.com/api/product-category';
  private baseUrl='http://localhost:8080/api/products';
  private categoryUrl= 'http://localhost:8080/api/product-category';


  constructor(private httpClient: HttpClient) { }

  getProductList(categoryId: number): Observable<Product[]> {

    // build URL based on category id
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`;

    return this.getProducts(searchUrl);
  };

  getProductCategories(): Observable<ProductCategory[]> {


    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory));
  }

  searchProducts(keyword: string): Observable<Product[]> {

    const searchUrl = `${this.baseUrl}/search/findByNameContainingIgnoreCase?name=${keyword}`;

    return this.getProducts(searchUrl);
  };

  
  searchProductsPaginate(page: number, pageSize: number, keyword: string): Observable<GetResponseProducts> {

    // build URL based on category id, page and size
    const searchUrl = `${this.baseUrl}/search/findByNameContainingIgnoreCase?name=${keyword}&page=${page}&size=${pageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  };


  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products));
  }

  getProductListPaginate(page: number, pageSize: number, categoryID: number): Observable<GetResponseProducts> {

    // build URL based on category id, page and size
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryID}&page=${page}&size=${pageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  };


  getProduct(productId: number): Observable<Product> {
    const searchUrl = `${this.baseUrl}/${productId}`;
    return this.httpClient.get<Product>(searchUrl);
  }

}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  }
  page: [
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  ]
}


interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}
