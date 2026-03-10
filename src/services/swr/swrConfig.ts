import apiClient from "./apiFetcher";
import { SWRConfiguration } from "swr";

// GET Fetcher
export const getFetcher = async (
  url: string,
  headers?: Record<string, string>
) => {
  const res = await apiClient.get(url, { headers });
  return res.data;
};

// POST Fetcher (Simple - No encryption)
export const postFetcher = async (
  url: string,
  data?: object | null,
  headers?: Record<string, string>
) => {
  const res = await apiClient.post(url, data, { headers });
  return res.data;
};

// PUT Fetcher
export const putFetcher = async (
  url: string,
  data?: object | null,
  headers?: Record<string, string>
) => {
  const res = await apiClient.put(url, data, { headers });
  return res.data;
};

// DELETE Fetcher
export const deleteFetcher = async (
  url: string,
  headers?: Record<string, string>
) => {
  const res = await apiClient.delete(url, { headers });
  return res.data;
};

// SWR Configuration
export const swrConfiguration: SWRConfiguration = {
  fetcher: getFetcher,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  shouldRetryOnError: false,
  dedupingInterval: 2000,
};