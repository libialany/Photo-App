export class CreatePhotoDTO {
  id: string;
  title: string;
  description: string;
}
export class UpdatePhotoDTO {
  id: string;
  title: string;
  url: string;
  description: string;
  id_user: string;
}
export class GetPhotoDTO {
  title: string;
}
