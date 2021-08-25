const API_PATH = '/api';

interface DefaultResponse {
  message: string;
}

export async function getPong(): Promise<DefaultResponse> {
  return fetch(`${API_PATH}/pong`, {
    method: 'GET',
  }).then((res) => res.json());
}
