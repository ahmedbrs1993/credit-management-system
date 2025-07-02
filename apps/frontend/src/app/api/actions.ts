import api from './api';

export interface Action {
  type: 'A' | 'B' | 'C';
  credits: number;
}

export interface CreditsType {
  A: number;
  B: number;
  C: number;
}

export async function fetchActions() {
  const response = await api.get('/actions');
  return response.data;
}

export async function postAction(type: string) {
  const response = await api.post('/actions', { type });
  return response.data;
}