import { Component, inject, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductoApiService } from '../services/producto-api.service';
import { IProducto } from '../models/producto.model';

@Component({
  selector: 'Form-Component',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent {

  productoAgregado = output<IProducto>();
  nuevoProducto: FormGroup;
  private _fb = inject(FormBuilder);
  private _productoApiService = inject(ProductoApiService);

  constructor() {
    this.nuevoProducto = this._fb.group({
      descripcion: ['', [Validators.required, Validators.maxLength(200)]],
      costo: ['', [Validators.required]],
      precio_venta: ['', [Validators.required]],
      estado: ['Activo', [Validators.required]],
    })
  }
 
  submitHandler(event: Event): void {
    event.preventDefault();
    if(this.nuevoProducto.invalid) return;
    this._productoApiService.nuevoProducto(this.nuevoProducto.value).subscribe({
      next: (producto: IProducto) => {
        this.productoAgregado.emit(producto);
        alert(`el producto fue agregado con el id ${producto.producto_id}`);
        this.nuevoProducto.reset();
      }
    })
  }

}