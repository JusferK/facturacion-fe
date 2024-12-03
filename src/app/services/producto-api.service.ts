import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProducto } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoApiService {

  baseURL = 'http://localhost:8080/producto';
  private _httpClient = inject(HttpClient);

  constructor() {}

  listaProductos(): Observable<IProducto[]> {
    return this._httpClient.get<IProducto[]>(`${this.baseURL}/productos`);
  }

  nuevoProducto(producto: IProducto): Observable<IProducto> {
    return this._httpClient.post<IProducto>(`${this.baseURL}/nuevo-producto`, producto);
  }

  editarProducto(producto: IProducto): Observable<IProducto> {
    return this._httpClient.put<IProducto>(`${this.baseURL}/editar-producto`, producto);
  }

  eliminarProducto(id: number): Observable<IProducto> {
    return this._httpClient.delete<IProducto>(`${this.baseURL}/eliminar-producto/${id}`);
  }
  
}
