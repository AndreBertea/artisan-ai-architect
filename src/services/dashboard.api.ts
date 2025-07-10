import { httpClient } from './http';

export const getStats = () => httpClient.get('/dashboard/stats');

export const getAlerts = () => httpClient.get('/dashboard/alerts');

export const getChartsData = (type: string) => httpClient.get(`/dashboard/charts/${type}`);