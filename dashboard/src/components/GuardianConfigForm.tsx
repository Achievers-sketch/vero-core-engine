import React, { useState } from 'react';
import Field from './Field';
import useZodForm from '../hooks/useZodForm';
import { guardianSettingsSchema, GUARDIAN_SETTINGS_DEFAULTS } from '../lib/validation';

export const GuardianConfigForm: React.FC = () => {
  const [saved, setSaved] = useState<string | null>(null);

  const { values, setValue, handleBlur, handleSubmit, visibleErrors, isValid, reset } = useZodForm(
    guardianSettingsSchema,
    GUARDIAN_SETTINGS_DEFAULTS,
    (_v) => {
      setSaved('Saved guardian configuration');
      setTimeout(() => setSaved(null), 3000);
    }
  );

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
      <h2 className="text-lg font-semibold mb-4">Guardian Configuration</h2>
      {saved ? <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">{saved}</div> : null}
      <form onSubmit={(e) => handleSubmit(e)}>
        <Field
          id="rpcEndpoint"
          label="Relayer RPC Endpoint"
          hint="HTTPS endpoint used to reach the relayer"
          value={values.rpcEndpoint}
          onChange={(v) => setValue('rpcEndpoint', v)}
          onBlur={() => handleBlur('rpcEndpoint')}
          error={visibleErrors.rpcEndpoint}
        />

        <Field
          id="signerThreshold"
          label="Signer Threshold"
          hint="Minimum number of guardian signatures required"
          value={String(values.signerThreshold)}
          onChange={(v) => setValue('signerThreshold', v)}
          onBlur={() => handleBlur('signerThreshold')}
          error={visibleErrors.signerThreshold}
          type="number"
        />

        <Field
          id="timeLockSecs"
          label="Time-lock (seconds)"
          hint="Delay enforced after proposal approval"
          value={String(values.timeLockSecs)}
          onChange={(v) => setValue('timeLockSecs', v)}
          onBlur={() => handleBlur('timeLockSecs')}
          error={visibleErrors.timeLockSecs}
          type="number"
        />

        <Field
          id="webhook"
          label="Optional webhook"
          hint="Optional URL to POST notifications to (leave empty to disable)"
          optional
          value={values.webhook}
          onChange={(v) => setValue('webhook', v)}
          onBlur={() => handleBlur('webhook')}
          error={visibleErrors.webhook}
        />

        <div className="flex gap-2 mt-4">
          <button
            type="submit"
            disabled={!isValid}
            className={`px-4 py-2 rounded bg-blue-600 text-white ${!isValid ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => reset()}
            className="px-4 py-2 rounded border"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default GuardianConfigForm;
