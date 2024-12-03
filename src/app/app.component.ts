import { Component, inject, signal } from '@angular/core';
import { FormComponent } from './form/form.component';
import { TableComponent } from './table/table.component';
import { IProducto } from './models/producto.model';
import { ProductoApiService } from './services/producto-api.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormComponent,
    TableComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  
  listaProductos = signal<IProducto[]>([]);
  signalBooleans = signal<boolean[]>([]);
  actualizarProducto: FormGroup;
  private _productoApiServicio = inject(ProductoApiService);
  private _fb = inject(FormBuilder);

  constructor() {
    this._productoApiServicio.listaProductos().subscribe({
      next: (productos: IProducto[]) => {
        this.listaProductos.set(productos);
        productos.forEach(() => this.signalBooleans.update(prev => [...prev, false]));
      }
    })

    this.actualizarProducto = this._fb.group({
      producto_id: [''],
      descripcion: [''],
      costo: [''],
      precio_venta: [''],
      estado: ['']
    })
  }

  nuevoProductoHandler(producto: IProducto): void {
    this.listaProductos.update(prev => [...prev, producto]);
  }

  eliminarProducto(producto: IProducto): void {
    this._productoApiServicio.eliminarProducto(producto.producto_id!).subscribe({
      next: ()=> {
        alert('producto eliminado, refrezcar paginar.');
      }
    })
  }

}
