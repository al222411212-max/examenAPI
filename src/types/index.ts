export interface Empresa {
  id_empresa?: number;
  nombre: string;
  giro: string;
  tamaño: string;
  teléfono: string;
  fecha_registro: string;
  ciudad: string;
  dirección: string;
}

export interface Vacante {
  id_vacante?: number;
  id_empresa: number;
  puesto: string;
  descripción: string;
  salario: number;
  modalidad: string;
  especialidad: string;
  fecha_publicación: string;
  estatus: string;
}

export interface Postulación {
  id_postulación?: number;
  id_vacante: number;
  nombre_postulante: string;
  correo: string;
  teléfono: string;
  cv_url: string;
  fecha_postulación: string;
  estatus: string;
}
