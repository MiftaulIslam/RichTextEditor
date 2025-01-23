import { useState, useCallback } from "react";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { base_url } from "@/static/data";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";


// const  {data, isLoading, isError, statusCode, sendRequest} = useHttp()


interface UseHttpReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  statusCode: number | null;
  sendRequest: (url: string, method?: HttpMethod, body?: unknown, config?: AxiosRequestConfig) => Promise<void>;
}
export function useHttp<T = unknown>(): UseHttpReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const sendRequest = useCallback(
    async (url: string, method: HttpMethod = "GET", body?: unknown, config?: AxiosRequestConfig) => {
      setLoading(true);
      setError(null);

      const source = axios.CancelToken.source();

      try {
        const response: AxiosResponse<T> = await axios({
          url: `${base_url}/${url}`,
          method,
          data: body,
          cancelToken: source.token,
          ...config,
        });
        setData(response.data);
        setStatusCode(response.status);
      } catch (err) {
        if (axios.isCancel(err)) {
          console.warn("Request cancelled");
        } else {
          setError((err as Error).message);
        }
        
        setStatusCode(500);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { data, loading, statusCode, error, sendRequest };
}
