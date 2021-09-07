import { Coords } from 'google-map-react';
import { LOGIN_TOKEN_NAME } from 'src/constants/AuthConstants';
import { EventData } from 'src/types/EventTypes';
import { UserDetails } from 'src/types/UserTypes';

const API_PATH = '/api';

export class FetchError extends Error {
  constructor(public res: Response, message?: string) {
    super(message);
  }
}

const getAuthToken = (): string => {
  const token = localStorage.getItem(LOGIN_TOKEN_NAME);
  return token ? token : '';
};

export async function getPong(): Promise<{ message: string }> {
  return fetch(`${API_PATH}/pong`, {
    method: 'GET',
  }).then((res) => res.json());
}

export async function userSignUp(
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<{ message: string }> {
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

export async function userLogin(email: string, password: string): Promise<{ token: string }> {
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
): Promise<{ message: string }> {
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

export async function editEvent(
  id: string,
  title: string,
  location: string,
  online: boolean,
  description: string,
  category: string,
  start: Date,
  end: Date,
  isPrivate: boolean
): Promise<{ message: string }> {
  const response = await fetch(`${API_PATH}/event/${id}`, {
    method: 'PUT',
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

export async function getAllEvents(
  ne: Coords,
  sw: Coords,
  title: string,
  category: string,
  hideOnline: boolean,
  hideNoLocation: boolean
): Promise<{ events: EventData[] }> {
  let url = `${API_PATH}/event/all?ne=${ne.lat},${ne.lng}&sw=${sw.lat},${sw.lng}&title=${title}&category=${category}`;

  if (hideOnline) {
    url = `${url}&showOnline=true`;
  }

  if (hideNoLocation) {
    url = `${url}&hasLocation=true`;
  }

  const response = await fetch(url, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new FetchError(response);
  }
  return response.json();
}

export async function getUserCreatedEvents(): Promise<{ events: EventData[] }> {
  const response = await fetch(`${API_PATH}/event/me`, {
    method: 'GET',
    headers: {
      Authorization: getAuthToken(),
    },
  });

  if (!response.ok) {
    throw new FetchError(response);
  }
  return response.json();
}

export async function getLocation(input: string): Promise<Coords> {
  const response = await fetch(`${API_PATH}/event/location?input=${input}`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new FetchError(response);
  }
  return response.json();
}

export async function getLocationSuggestions(input: string): Promise<{ locations: string[] }> {
  const response = await fetch(`${API_PATH}/event/suggestions?input=${input}`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new FetchError(response);
  }
  return response.json();
}

export async function getEvent(id: string): Promise<EventData> {
  const response = await fetch(`${API_PATH}/event/${id}`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new FetchError(response);
  }
  return response.json();
}

export async function deleteEvent(id: string): Promise<{ message: string }> {
  const response = await fetch(`${API_PATH}/event/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: getAuthToken(),
    },
  });

  if (!response.ok) {
    throw new FetchError(response);
  }
  return response.json();
}

export async function getUserMyself(): Promise<UserDetails> {
  const response = await fetch(`${API_PATH}/user/me`, {
    method: 'GET',
    headers: {
      Authorization: getAuthToken(),
    },
  });

  if (!response.ok) {
    throw new FetchError(response);
  }
  return response.json();
}

export async function updateUserDetails(email: string, firstName: string, lastName: string): Promise<UserDetails> {
  const response = await fetch(`${API_PATH}/user/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getAuthToken(),
    },
    body: JSON.stringify({
      email: email,
      firstName: firstName,
      lastName: lastName,
    }),
  });

  if (!response.ok) {
    throw new FetchError(response);
  }
  return response.json();
}
