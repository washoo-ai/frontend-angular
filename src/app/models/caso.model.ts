export interface Cliente {
  id: number;
  nombres: string;
  apellidos: string;
}

export interface Caso {
  id: number;
  titulo: string;
  descripcion: string;
  estado: string;
  fechaInicio: string;
  fechaLimite: string;
  cliente: Cliente;   // 👈 IMPORTANTE
}