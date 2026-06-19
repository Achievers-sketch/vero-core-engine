import React from 'react';

type FieldProps = {
  id: string;
  label: string;
  hint?: string;
  optional?: boolean;
  value: string | number;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string | null;
  type?: string;
};

export const Field: React.FC<FieldProps> = ({
  id,
  label,
  hint,
  optional,
  value,
  onChange,
  onBlur,
  error,
  type = 'text',
}) => {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium mb-1">
        {label} {optional ? <span className="text-sm opacity-70">(optional)</span> : null}
      </label>
      <input
        id={id}
        className={`w-full rounded-md border p-2 bg-white dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-blue-400 ${
          error ? 'border-red-500 ring-red-200' : ''
        }`}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        value={value as any}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        type={type}
      />
      {hint ? (
        <p id={hintId} className="text-xs opacity-70 mt-1">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="text-xs text-red-600 mt-1">
          {error}
        </p>
      ) : null}
    </div>
  );
};

export default Field;
