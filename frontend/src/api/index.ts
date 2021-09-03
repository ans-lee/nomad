import { LOGIN_TOKEN_NAME } from 'src/constants/AuthConstants';

const API_PATH = '/api';

export interface DefaultResponse {
  message: string;
}

export interface LoginResponse {
  token: string;
}

export interface EventData {
  id: string;
  title: string;
  location: string;
  lat: number;
  lng: number;
  online: boolean;
  description: string;
  category: string;
  start: string;
  end: string;
  visibility: string;
  groupID: string;
}

export interface EventsListResponse {
  events: EventData[];
}

export class FetchError extends Error {
  constructor(public res: Response, message?: string) {
    super(message);
  }
}

const getAuthToken = (): string => {
  const token = localStorage.getItem(LOGIN_TOKEN_NAME);
  return token ? token : '';
};

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

export async function createEvent(
  title: string,
  location: string,
  online: boolean,
  description: string,
  category: string,
  start: Date,
  end: Date,
  isPrivate: boolean
): Promise<DefaultResponse> {
  const response = await fetch(`${API_PATH}/event/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getAuthToken(),
    },
    body: JSON.stringify({
      title: title,
      location: location,
      online: online,
      description: description,
      category: category,
      start: start.toISOString(),
      end: end.toISOString(),
      visibility: isPrivate ? 'private' : 'public',
    }),
  });

  if (!response.ok) {
    throw new FetchError(response);
  }
  return response.json();
}

export async function getAllEvents(): Promise<EventsListResponse> {
  const response = await fetch(`${API_PATH}/event/all`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new FetchError(response);
  }
  return response.json();
}
