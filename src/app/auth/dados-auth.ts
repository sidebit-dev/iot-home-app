export class LoginForm {
  login!: string;
  senha!: string;
}

export class CadastroUsuarioForm {
  name!: string;
  login!: string;
  senha!: string;
}

export class AuthResponse {
  token!: string;
  tipo!: string;
  expiraEm!: number;
  name!: string;
}