import { useState, useCallback } from 'react';

interface UseFormState {
  [key: string]: any;
}

interface UseFormCallbacks {
  onSubmit: (values: UseFormState) => Promise<void> | void;
}

export const useForm = (initialValues: UseFormState, callbacks: UseFormCallbacks) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<UseFormState>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e: any) => {
    const { name, value, type, checked } = e.target || e;
    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  }, [errors]);

  const handleSubmit = useCallback(
    async (e?: any) => {
      e?.preventDefault();
      setIsSubmitting(true);
      try {
        await callbacks.onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, callbacks]
  );

  const setFieldValue = useCallback((name: string, value: any) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const setFieldError = useCallback((name: string, error: string) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  }, []);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    setFieldValue,
    setFieldError,
    resetForm,
  };
};
