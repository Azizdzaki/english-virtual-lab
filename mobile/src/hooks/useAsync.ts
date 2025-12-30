import { useState, useCallback } from 'react';

interface UseAsyncState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
}

interface UseAsyncCallbacks<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  onFinally?: () => void;
}

export const useAsync = <T,>(
  asyncFunction: () => Promise<T>,
  immediate = true,
  callbacks?: UseAsyncCallbacks<T>
) => {
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    error: null,
    isLoading: immediate,
  });

  const execute = useCallback(async () => {
    setState({ data: null, error: null, isLoading: true });
    try {
      const response = await asyncFunction();
      setState({ data: response, error: null, isLoading: false });
      callbacks?.onSuccess?.(response);
      return response;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      setState({ data: null, error: err, isLoading: false });
      callbacks?.onError?.(err);
      throw err;
    } finally {
      callbacks?.onFinally?.();
    }
  }, [asyncFunction, callbacks]);

  if (immediate) {
    useState(() => {
      execute();
    });
  }

  return { ...state, execute };
};

export default useAsync;
