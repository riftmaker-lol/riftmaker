import { toast } from '@/components/ui/use-toast';
import { useState } from 'react';

interface ActionResponse {
  message: string;
}

const useAction = <Func extends (...args: never) => void, R extends ActionResponse = ActionResponse>(
  action: (...params: Parameters<Func>) => Promise<R>,
  onSuccess?: () => void,
  onFail = (message: string) =>
    toast({
      title: 'Error',
      description: message,
      variant: 'destructive',
    }),
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = async (...params: Parameters<Func>) => {
    try {
      setLoading(true);
      const result = await action(...params);
      if (result.message === 'Success') {
        onSuccess && onSuccess();
      } else {
        onFail && onFail(result.message);
      }
    } catch (e) {
      const error = e as Error;
      console.error('Failed to execute action', error);
      setError(error);
      onFail && onFail(error.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    execute,
    loading,
    error,
  };
};

export default useAction;
