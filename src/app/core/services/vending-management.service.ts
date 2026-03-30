import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse, CategoryDto, CategoryFilterDto, ChangeProductStatusDto, CreateCategoryDto, PagedResult, ProductDto, ProductFilterDto, SaveKioskLinesDto, UpdateCategoryDto, VendingMachineDto } from '../models/models/vending-management.model';


@Injectable({
  providedIn: 'root',
})
export class VendingManagementService {
  private http = inject(HttpClient);

  private categoryBase = '/api/Category';
  private productBase = '/api/Product';

  getCategories(filter: CategoryFilterDto): Observable<ApiResponse<PagedResult<CategoryDto>>> {
    return this.http.post<ApiResponse<PagedResult<CategoryDto>>>(
      `${this.categoryBase}/get-all`,
      filter
    );
  }

  getCategoryById(id: number): Observable<ApiResponse<CategoryDto>> {
    return this.http.post<ApiResponse<CategoryDto>>(
      `${this.categoryBase}/get-by-id-${id}`,
      {}
    );
  }

  createCategory(dto: CreateCategoryDto): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.categoryBase}/create`, dto);
  }

  updateCategory(dto: UpdateCategoryDto): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.categoryBase}/update`, dto);
  }

  deleteCategory(id: number): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.categoryBase}/delete-${id}`, {});
  }

  getProducts(filter: ProductFilterDto): Observable<ApiResponse<PagedResult<ProductDto>>> {
    return this.http.post<ApiResponse<PagedResult<ProductDto>>>(
      `${this.productBase}/get-all`,
      filter
    );
  }

  getProductById(id: number): Observable<ApiResponse<ProductDto>> {
    return this.http.post<ApiResponse<ProductDto>>(
      `${this.productBase}/get-by-id-${id}`,
      {}
    );
  }

  createProduct(formData: FormData): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.productBase}/create`, formData);
  }

  updateProduct(formData: FormData): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.productBase}/update`, formData);
  }

  changeProductStatus(dto: ChangeProductStatusDto): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(
      `${this.productBase}/change-status-active`,
      dto
    );
  }

  deleteProduct(id: number): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.productBase}/delete-${id}`, {});
  }


  // Kiosks Line (Vending Machines) Services
  private kioskLineBase = '/api/KioskLine';

getLinesForAllKiosks(): Observable<ApiResponse<VendingMachineDto[]>> {
  return this.http.post<ApiResponse<VendingMachineDto[]>>(
    `${this.kioskLineBase}/get-lines-for-all-kiosks`,
    {}
  );
}

getLinesForKiosk(kioskId: number): Observable<ApiResponse<VendingMachineDto>> {
  return this.http.post<ApiResponse<VendingMachineDto>>(
    `${this.kioskLineBase}/get-lines-for-kiosk-${kioskId}`,
    {}
  );
}

saveKioskLines(dto: SaveKioskLinesDto): Observable<ApiResponse<string>> {
  return this.http.post<ApiResponse<string>>(
    `${this.kioskLineBase}/save-lines`,
    dto
  );
}
}