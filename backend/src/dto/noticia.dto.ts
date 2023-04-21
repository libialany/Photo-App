export class CreateNoticiaDTO {
  id_categoria: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  autor: string;
  banner: string;
  id_departamento: string;
}
export class UpdateNoticiaDTO {
  id_categoria: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  autor: string;
  banner: string;
  id_departamento: string;
}
export class GetNoticiaDTO {
  titulo: string;
}
