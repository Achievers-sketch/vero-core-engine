import { useCallback, useMemo, useState } from 'react';
import type { ZodType, ZodError } from 'zod';

type Errors = Record<string, string>;

export function useZodForm<T extends ZodType<any, any>>(schema: T, initialValues: any, onValid?: (v: any) => void) {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const parseResult = useMemo(() => schema.safeParse(values), [schema, values]);

  const rawErrors: Errors = useMemo(() => {
    if (parseResult.success) return {};
    const map: Errors = {};
    (parseResult.error as ZodError).issues.forEach((i) => {
      const key = Array.isArray(i.path) && i.path.length ? String(i.path[0]) : '_form';
      if (!map[key]) map[key] = i.message;
    });
    return map;
  }, [parseResult]);

  const visibleErrors = useMemo(() => {
    if (submitAttempted) return rawErrors;
    const filtered: Errors = {};
    for (const k of Object.keys(rawErrors)) {
      if (touched[k]) filtered[k] = rawErrors[k];
    }
    return filtered;
  }, [rawErrors, touched, submitAttempted]);

  const isValid = parseResult.success;

  const setValue = useCallback((field: string, v: any) => {
    setValues((s: any) => ({ ...s, [field]: v }));
  }, []);

  const handleBlur = useCallback((field: string) => {
    setTouched((t) => ({ ...t, [field]: true }));
  }, []);

  const handleSubmit = useCallback(
    (e?: Event | any) => {
      if (e && typeof e.preventDefault === 'function') e.preventDefault();
      setSubmitAttempted(true);
      if (schema.safeParse(values).success) {
        onValid?.(values);
      }
    },
    [onValid, schema, values]
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setTouched({});
    setSubmitAttempted(false);
  }, [initialValues]);

  return {
    values,
    setValue,
    handleBlur,
    handleSubmit,
    reset,
    visibleErrors,
    rawErrors,
    isValid,
  };
}

export default useZodForm;
