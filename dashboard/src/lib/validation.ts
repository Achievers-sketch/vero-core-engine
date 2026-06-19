import { z } from 'zod';

const base32Regex = /^[A-Z2-7]+$/;

export const httpsUrl = z
  .string()
  .trim()
  .url()
  .refine((s) => s.startsWith('https://'), { message: 'Must use https:// URL' });

export const httpUrl = (allowHttp = false) =>
  z
    .string()
    .trim()
    .url()
    .refine((s) => allowHttp || s.startsWith('https://'), {
      message: allowHttp ? 'Invalid URL' : 'Must use https:// URL',
    });

export const stellarAddress = z
  .string()
  .trim()
  .refine((s) => s.length === 56 && /^[GC]/.test(s) && base32Regex.test(s.slice(1)), {
    message: 'Must be a valid Stellar address (G... or C..., 56 base32 chars)',
  });

export const boundedInt = (min: number, max: number, label = 'Value') =>
  z.preprocess((val) => {
    if (typeof val === 'string') {
      const n = Number(val);
      return Number.isNaN(n) ? val : n;
    }
    return val;
  }, z.number().int().min(min, { message: `${label} must be ≥ ${min}` }).max(max, { message: `${label} must be ≤ ${max}` }));

export const boundedPercent = (label = 'Percent') => boundedInt(0, 100, label);

export const optionalUrl = z
  .string()
  .trim()
  .refine((s) => s === '' || /^https?:\/\//.test(s) && (() => {
    try { new URL(s); return true; } catch { return false; }
  })(), { message: 'Must be a valid URL or empty' });

export const guardianSettingsSchema = z.object({
  rpcEndpoint: httpsUrl,
  signerThreshold: boundedInt(1, 255, 'Signer threshold'),
  timeLockSecs: boundedInt(0, 60 * 60 * 24 * 365, 'Time-lock (s)'),
  webhook: optionalUrl,
});

export type GuardianSettings = z.infer<typeof guardianSettingsSchema>;

export const GUARDIAN_SETTINGS_DEFAULTS: GuardianSettings = {
  rpcEndpoint: 'https://example.com',
  signerThreshold: 1,
  timeLockSecs: 0,
  webhook: '',
};

export default {
  httpsUrl,
  httpUrl,
  stellarAddress,
  boundedInt,
  boundedPercent,
  optionalUrl,
  guardianSettingsSchema,
  GUARDIAN_SETTINGS_DEFAULTS,
};
