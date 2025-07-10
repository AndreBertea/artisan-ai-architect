import { httpClient } from './http';

export const getInterventions = (filters = {}) => 
  httpClient.get('/interventions');

export const getIntervention = (id: string) => 
  httpClient.get(`/interventions/${id}`);

export const updateStatus = (id: string, status: string) => 
  httpClient.put(`/interventions/${id}/status`, { status });

export const addComment = (id: string, content: string) => 
  httpClient.post(`/interventions/${id}/comments`, { content });

export const uploadAttachment = (id: string, file: File) => 
  httpClient.post(`/interventions/${id}/attachments`, { file });

export const exportCsv = (filters = {}) => 
  httpClient.get('/interventions/export-csv');