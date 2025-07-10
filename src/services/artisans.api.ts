import { httpClient } from './http';

export const getArtisans = (filters = {}) => 
  httpClient.get('/artisans');

export const getArtisan = (id: string) => 
  httpClient.get(`/artisans/${id}`);

export const updateStatus = (id: string, status: string) => 
  httpClient.put(`/artisans/${id}/statut`, { status });

export const addAbsence = (id: string, absence: any) => 
  httpClient.post(`/artisans/${id}/absences`, absence);

export const getDocuments = (id: string) => 
  httpClient.get(`/artisans/${id}/documents`);

export const uploadDocument = (id: string, document: any) => 
  httpClient.post(`/artisans/${id}/documents`, document);