export class ConfirmarResetDto {
  token: string;
  password: string;  // Ojo, que el campo sea 'password' porque en el JSON envías "password"
}