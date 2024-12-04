import { Component, computed, inject, signal } from '@angular/core';
import { FormComponent } from './form/form.component';
import { TableComponent } from './table/table.component';
import { IProducto } from './models/producto.model';
import { ProductoApiService } from './services/producto-api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormComponent,
    CurrencyPipe,
    ReactiveFormsModule
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
      producto_id: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      costo: ['', [Validators.required]],
      precio_venta: ['', [Validators.required]],
      estado: ['', [Validators.required]]
    })
  }

  nuevoProductoHandler(producto: IProducto): void {
    this.listaProductos.update(prev => [...prev, producto]);
  }

  eliminarProducto(producto: IProducto): void {
    this._productoApiServicio.eliminarProducto(producto.producto_id!).subscribe({
      next: ()=> {
        this.listaProductos.update((prev: IProducto[]) => prev.filter((iteracion_producto: IProducto) => iteracion_producto.producto_id !==producto.producto_id!));
      }
    });
  }

  actualizarBooleans(index: number, producto: IProducto):void {
    this.actualizarProducto.get('producto_id')?.setValue(producto.producto_id);
    this.actualizarProducto.get('descripcion')?.setValue(producto.descripcion);
    this.actualizarProducto.get('costo')?.setValue(producto.costo);
    this.actualizarProducto.get('precio_venta')?.setValue(producto.precio_venta);
    this.actualizarProducto.get('estado')?.setValue(producto.estado);

    this.signalBooleans.update(prev => {
      prev[index] = true;
      return prev;
    });
  }

  guardarCambiosHandler(index: number): void {
    

    this._productoApiServicio.editarProducto(this.actualizarProducto.value).subscribe({
      next: (producto_editado: IProducto) => {
        this.listaProductos.update(prev => prev.map(producto => {
          if(producto.producto_id === producto_editado.producto_id) {
            producto = producto_editado;
            return producto;
          } else {
            return producto;
          }
        }));

        this.signalBooleans.update(prev => {
          prev[index] = false;
          return prev;
        });
      }
    })
  }

  checkTrue(value: boolean): boolean {
    return value === true;
  }

  cancelarEdicion(index: number): void {
    this.signalBooleans.update(prev => {
      prev[index] = false;
      return prev;
    });
  }

}
