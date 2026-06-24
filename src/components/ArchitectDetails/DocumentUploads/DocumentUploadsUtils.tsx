import type { Dispatch, SetStateAction } from 'react';
import { IFilesData } from 'src/common/components/CustomDocumentPicker/CustomDocumentPicker';
import { ALLOW_FILE_SIZE_BYTES } from 'src/constants';
import { translateMessage } from 'src/i18n/createTranslation';

// ─── MIME helpers ─────────────────────────────────────────────────────────────

/** Common format groups for convenience */
export const FORMAT = {
  IMAGE: ['image/png', 'image/jpeg', 'image/jpg'] as string[],
  PDF: ['application/pdf'] as string[],
  DOCX: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'] as string[],
};

/** Convert bytes to a display label, e.g. 5242880 → "5 MB" */
export function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024 * 1024) return `${Math.round(bytes / (1024 * 1024 * 1024))} GB`;
  if (bytes >= 1024 * 1024) return `${Math.round(bytes / (1024 * 1024))} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
}

/** Resolved MIME → extension label, e.g. "application/pdf" → "PDF" */
export function mimeToExtLabel(mime: string): string {
  return mime.split('/').pop()?.toUpperCase() ?? mime;
}

// ─── Document field definition ────────────────────────────────────────────────

export interface IDocumentField {
  /** Unique key used as the state map key */
  key: string;
  /** i18n translation key for the label shown in the row */
  labelKey: string;
  /** Whether the user MUST upload this document before submitting */
  required?: boolean;
  /**
   * Accepted MIME types for this specific field.
   * Falls back to DEFAULT_ACCEPTED_TYPES when omitted.
   */
  allowedTypes?: string[];
  /**
   * Maximum file size in bytes for this specific field.
   * Falls back to ALLOW_FILE_SIZE_BYTES (10 MB) when omitted.
   */
  maxSizeBytes?: number;
}

/** Default accepted MIME types used when a field doesn't define its own */
export const DEFAULT_ACCEPTED_TYPES: string[] = [
  ...FORMAT.IMAGE,
  ...FORMAT.PDF,
];

export const DOCUMENT_FIELDS: IDocumentField[] = [
  {
    key: 'aadhar',
    labelKey: 'Admin.Sida.App.DocumentUpload.Field.Aadhar',
    required: true,
    allowedTypes: [...FORMAT.IMAGE, ...FORMAT.PDF],
    maxSizeBytes: 5 * 1024 * 1024,   // 5 MB
  },
  {
    key: 'pan',
    labelKey: 'Admin.Sida.App.DocumentUpload.Field.Pan',
    required: true,
    allowedTypes: [...FORMAT.IMAGE, ...FORMAT.PDF],
    maxSizeBytes: 5 * 1024 * 1024,   // 5 MB
  },
  {
    key: 'class10',
    labelKey: 'Admin.Sida.App.DocumentUpload.Field.Class10',
    required: true,
    allowedTypes: [...FORMAT.PDF, ...FORMAT.DOCX],
    maxSizeBytes: 10 * 1024 * 1024,  // 10 MB
  },
  {
    key: 'class12',
    labelKey: 'Admin.Sida.App.DocumentUpload.Field.Class12',
    required: true,
    allowedTypes: [...FORMAT.PDF, ...FORMAT.DOCX],
    maxSizeBytes: 10 * 1024 * 1024,  // 10 MB
  },
  {
    key: 'btech',
    labelKey: 'Admin.Sida.App.DocumentUpload.Field.Btech',
    required: true,
    allowedTypes: [...FORMAT.PDF, ...FORMAT.DOCX],
    maxSizeBytes: 10 * 1024 * 1024,  // 10 MB
  },
  {
    key: 'registration',
    labelKey: 'Admin.Sida.App.DocumentUpload.Field.Registration',
    required: true,
    allowedTypes: [...FORMAT.PDF, ...FORMAT.DOCX],
    maxSizeBytes: 10 * 1024 * 1024,  // 10 MB
  },
  {
    key: 'experience',
    labelKey: 'Admin.Sida.App.DocumentUpload.Field.Experience',
    required: false,
    allowedTypes: [...FORMAT.PDF, ...FORMAT.DOCX],
    maxSizeBytes: 10 * 1024 * 1024,  // 10 MB
  },
  {
    key: 'portfolio',
    labelKey: 'Admin.Sida.App.DocumentUpload.Field.Portfolio',
    required: false,
    allowedTypes: [...FORMAT.IMAGE, ...FORMAT.PDF],
    maxSizeBytes: 20 * 1024 * 1024,  // 20 MB
  },
];

// ─── State types ──────────────────────────────────────────────────────────────

export type IDocumentFilesState = Record<string, IFilesData | null>;

export type IDocumentErrors = Record<string, string> & { apiError: string };

export interface IDocumentUploadsProps {
  errors: IDocumentErrors;
  setErrors: Dispatch<SetStateAction<IDocumentErrors>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  pickerErrors: Record<string, string>;
  setPickerErrors: Dispatch<SetStateAction<Record<string, string>>>;
  files?: IDocumentFilesState;
  onFilesChange?: (files: IDocumentFilesState) => void;
}

// ─── Initial state factories ──────────────────────────────────────────────────

export function generateInitialFilesState(): IDocumentFilesState {
  return Object.fromEntries(DOCUMENT_FIELDS.map((d) => [d.key, null]));
}

export function generateInitialErrors(): IDocumentErrors {
  const fieldErrors = Object.fromEntries(DOCUMENT_FIELDS.map((d) => [d.key, '']));
  return { ...fieldErrors, apiError: '' };
}

// ─── Validation ───────────────────────────────────────────────────────────────

export interface IValidationResult {
  isValid: boolean;
  errors: IDocumentErrors;
}

export function validateDocumentUploads(files: IDocumentFilesState): IValidationResult {
  const errors = generateInitialErrors();
  let isValid = true;

  for (const field of DOCUMENT_FIELDS) {
    const file = files[field.key];
    const label = translateMessage(field.labelKey);

    // Required check
    if (field.required && !file) {
      errors[field.key] = translateMessage(
        'Admin.Sida.App.DocumentUpload.Error.Required',
        { label },
      );
      isValid = false;
      continue;
    }

    if (!file) continue;

    // MIME type check — also verify by extension when MIME is empty (browser quirk)
    const allowed = field.allowedTypes ?? DEFAULT_ACCEPTED_TYPES;
    const mimeOk = !!file.fileType && allowed.includes(file.fileType);
    const extOk = (() => {
      const ext = file.fileName?.split('.').pop()?.toLowerCase() ?? '';
      return allowed.some((t) => t.split('/').pop()?.toLowerCase() === ext);
    })();

    if (!mimeOk && !extOk) {
      const formats = allowed
        .map((t) => t.split('/').pop()?.toUpperCase())
        .filter(Boolean)
        .join(', ');
      errors[field.key] = translateMessage(
        'Admin.Sida.App.DocumentUpload.Error.InvalidType',
        { label, formats },
      );
      isValid = false;
      continue;
    }

    // File size check (blob size is authoritative)
    const maxBytes = field.maxSizeBytes ?? ALLOW_FILE_SIZE_BYTES;
    const fileSize = file.blob?.size ?? 0;
    if (fileSize > maxBytes) {
      errors[field.key] = translateMessage(
        'Admin.Sida.App.DocumentUpload.Error.SizeExceeded',
        { label, size: formatBytes(maxBytes) },
      );
      isValid = false;
    }
  }

  return { isValid, errors };
}
