/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { api_url } from "@/config/config";
// import { base_url } from "@/static/data";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface UseHttpReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  statusCode: number | null;
  sendRequest: (url: string, method?: HttpMethod, body?: unknown, config?: AxiosRequestConfig) => Promise<boolean>;
}

export function useHttp<T = unknown>(): UseHttpReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const sendRequest = useCallback(
    async (url: string, method: HttpMethod = "GET", body?: unknown, config?: AxiosRequestConfig): Promise<boolean> => {
      setLoading(true);
      setError(null);

      const source = axios.CancelToken.source();

      try {
        const response: AxiosResponse<T> = await axios({
          url: `${api_url}/${url}`,
          method,
          data: body,
          cancelToken: source.token,
          ...config,
        });
        
        setData(response.data);
        setStatusCode(response.status);
        
        // Return true for successful responses (2xx status codes)
        return response.status >= 200 && response.status < 300;
      } catch (err:any) {
        if (axios.isCancel(err)) {
          console.warn("Request cancelled");
          return false;
        }
        
        const errorMessage = axios.isAxiosError(err) 
          ? (err.response?.data?.message || err.message) as string
          : (err as Error).message;
        
        setError(errorMessage);
        setStatusCode(err?.response?.status || 500);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { data, loading, statusCode, error, sendRequest };
}
