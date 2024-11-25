import axios, { AxiosError } from "axios";
import { useState, useEffect } from "react";
import useInterceptor from "./useInterceptor";

interface FetchResult<T> {
    data: T | null;
    isLoading: boolean;
    error: AxiosError | unknown | null;
}
/* hook to fetch single non array objects */
export const useSingleFetch = <T>(url: string): FetchResult<T> => {
    const axiosPrivate = useInterceptor();
    const [data, setData] = useState<T | null>(null); // Use the generic type parameter here
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<AxiosError | unknown | null>(null);
    
    useEffect(() => {
        let isMounted = true;
        const abortFetch: AbortController = new AbortController();
        const signal: AbortSignal = abortFetch.signal;
        
        const getData = async () => {
            try {
                setIsLoading(true);
                const response = await axiosPrivate.get<T>(url, { signal });
                if (isMounted) {
                    setData(response.data);
                    setIsLoading(false);
                    setError(null);
                }
            } catch (error: unknown) {
                setIsLoading(false);
                if (axios.isAxiosError(error)) {
                    setError(error);
                } else {
                    setError(error);
                }
            }
        };
        getData();
        return () => {
            isMounted = false;
            abortFetch.abort();
        };
    }, [url]);

    return { data, isLoading, error };
};