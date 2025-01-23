import { useCallback } from "react";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { base_url } from "@/static/data";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";


// const { fetchRequest } = useFetchQuery()


interface UseFetchQueryReturn<T> {
  fetchRequest: (url: string, method?: HttpMethod, body?: unknown, config?: AxiosRequestConfig) => Promise<T>;
}

export function useFetchQuery<T = unknown>(): UseFetchQueryReturn<T> {
  const fetchRequest = useCallback(
    async (url: string, method: HttpMethod = "GET", body?: unknown, config?: AxiosRequestConfig) => {
      try {
        const response: AxiosResponse<T> = await axios({
          url: `${base_url}/${url}`,
          method,
          data: body,
          ...config,
        });
        return response.data;
      } catch (err) {
        throw new Error((err as Error).message);
      }
    },
    []
  );

  return { fetchRequest };
}
