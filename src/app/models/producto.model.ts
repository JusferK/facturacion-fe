enum Estado {
    Activo = 'activo',
    Inactivo = 'inactivo'
}

export interface IProducto {
    producto_id?: number,
    descripcion: string,
    costo: number,
    precio_venta: number,
    estado: Estado
}