const API_PATH = '/api';

interface DefaultResponse {
  message: string;
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
  return fetch(`${API_PATH}/auth/signup`, {
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
  }).then((res) => res.json());
}
