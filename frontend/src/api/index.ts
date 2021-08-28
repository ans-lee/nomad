const API_PATH = '/api';

interface DefaultResponse {
  message: string;
}

interface LoginResponse {
  token: string;
}

export class FetchError extends Error {
  constructor(public res: Response, message?: string) {
    super(message);
  }
}

export async function getPong(): Promise<DefaultResponse> {
  return fetch(`${API_PATH}/pong`, {
    method: 'GET',
  }).then((res) => res.json());
}

export async function userSignUp(
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<DefaultResponse> {
  const response = await fetch(`${API_PATH}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
    }),
  });

  if (!response.ok) {
    throw new FetchError(response);
  }
  return response.json();
}

export async function userLogin(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_PATH}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });

  if (!response.ok) {
    throw new FetchError(response);
  }
  return response.json();
}
