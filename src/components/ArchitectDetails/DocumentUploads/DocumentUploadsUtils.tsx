import { Dispatch, SetStateAction } from 'react';
import { IFilesData } from 'src/common/components/CustomDocumentPicker/CustomDocumentPicker';
import { ALLOW_FILE_SIZE_BYTES } from 'src/constants';

// ─── MIME helpers ─────────────────────────────────────────────────────────────

/** Common format groups for convenience */
export const FORMAT = {
  IMAGE: ['image/png', 'image/jpeg', 'image/jpg'] as string[],
  PDF:   ['application/pdf'] as string[],
  DOCX:  ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'] as string[],
};

/** Convert bytes to a display label, e.g. 5242880 → "5 MB" */
export function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024 * 1024) return `${Math.round(bytes / (1024 * 1024 * 1024))} GB`;
  if (bytes >= 1024 * 1024)        return `${Math.round(bytes / (1024 * 1024))} MB`;
  if (bytes >= 1024)               return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
}

// ─── Document field definition ────────────────────────────────────────────────

export interface IDocumentField {
  /** Unique key used as the state map key */
  key: string;
  /** Human-readable label shown in the row */
  label: string;
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
    key:          'aadhar',
    label:        'Aadhar Card Details',
    required:     true,
    allowedTypes: [...FORMAT.IMAGE, ...FORMAT.PDF],
    maxSizeBytes: 5 * 1024 * 1024,   // 5 MB
  },
  {
    key:          'pan',
    label:        'PAN Card',
    required:     true,
    allowedTypes: [...FORMAT.IMAGE, ...FORMAT.PDF],
    maxSizeBytes: 5 * 1024 * 1024,   // 5 MB
  },
  {
    key:          'class10',
    label:        '10th Certificate',
    required:     true,
    allowedTypes: [...FORMAT.PDF, ...FORMAT.DOCX],
    maxSizeBytes: 10 * 1024 * 1024,  // 10 MB
  },
  {
    key:          'class12',
    label:        '12th Certificate',
    required:     true,
    allowedTypes: [...FORMAT.PDF, ...FORMAT.DOCX],
    maxSizeBytes: 10 * 1024 * 1024,  // 10 MB
  },
  {
    key:          'btech',
    label:        'B.Tech Certificate',
    required:     true,
    allowedTypes: [...FORMAT.PDF, ...FORMAT.DOCX],
    maxSizeBytes: 10 * 1024 * 1024,  // 10 MB
  },
  {
    key:          'registration',
    label:        'Architect Registration Certificate',
    required:     true,
    allowedTypes: [...FORMAT.PDF, ...FORMAT.DOCX],
    maxSizeBytes: 10 * 1024 * 1024,  // 10 MB
  },
  {
    key:          'experience',
    label:        'Experience Certificate',
    required:     false,
    allowedTypes: [...FORMAT.PDF, ...FORMAT.DOCX],
    maxSizeBytes: 10 * 1024 * 1024,  // 10 MB
  },
  {
    key:          'portfolio',
    label:        'Portfolio / Work Samples',
    required:     false,
    allowedTypes: [...FORMAT.IMAGE, ...FORMAT.PDF],
    maxSizeBytes: 20 * 1024 * 1024,  // 20 MB
  },
];

// ─── State types ──────────────────────────────────────────────────────────────

export type IDocumentFilesState = Record<string, IFilesData | null>;

export type IDocumentErrors = Record<string, string> & { apiError: string };

export interface IDocumentUploadsProps {
  /** Controlled file state (optional — component manages internally when omitted) */
  files?: IDocumentFilesState;
  onFilesChange?: (files: IDocumentFilesState) => void;
}

export interface IDocumentUploadsInternalProps extends IDocumentUploadsProps {
  setErrors?: Dispatch<SetStateAction<IDocumentErrors>>;
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

    // Required check
    if (field.required && !file) {
      errors[field.key] = `${field.label} is required.`;
      isValid = false;
      continue;
    }

    if (!file) continue;

    // MIME type check
    const allowed = field.allowedTypes ?? DEFAULT_ACCEPTED_TYPES;
    if (file.fileType && !allowed.includes(file.fileType)) {
      const exts = allowed
        .map((t) => t.split('/').pop()?.toUpperCase())
        .filter(Boolean)
        .join(', ');
      errors[field.key] = `${field.label} must be one of: ${exts}.`;
      isValid = false;
      continue;
    }

    // File size check (blob size is authoritative)
    const maxBytes = field.maxSizeBytes ?? ALLOW_FILE_SIZE_BYTES;
    const fileSize = file.blob?.size ?? 0;
    if (fileSize > maxBytes) {
      errors[field.key] =
        `${field.label} exceeds the maximum size of ${formatBytes(maxBytes)}.`;
      isValid = false;
    }
  }

  return { isValid, errors };
}

// ─── Picker helper ────────────────────────────────────────────────────────────

import * as DocumentPicker from 'expo-document-picker';

/**
 * Opens the OS document picker scoped to the field's allowed types.
 * Returns the picked file data or null if cancelled.
 */
export async function pickDocumentForField(
  field: IDocumentField,
): Promise<IFilesData | null> {
  const allowedTypes = field.allowedTypes ?? DEFAULT_ACCEPTED_TYPES;

  const result = await DocumentPicker.getDocumentAsync({
    multiple: false,
    type: allowedTypes,
  });

  if (result.canceled || !result.assets?.length) return null;

  const asset = result.assets[0];

  // Size pre-check before any blob work
  const maxBytes = field.maxSizeBytes ?? ALLOW_FILE_SIZE_BYTES;
  if (asset.size && asset.size > maxBytes) {
    // Return the file but let validation surface the error
  }

  let blob: Blob | undefined;
  try {
    const nativeFile = (asset as unknown as { file?: File }).file;
    if (nativeFile) {
      blob = nativeFile;
    } else {
      const response = await fetch(asset.uri);
      blob = await response.blob();
    }
  } catch {
    blob = undefined;
  }

  return {
    uri:      asset.uri,
    fileName: asset.name,
    blob,
    fileType: asset.mimeType ?? '',
  };
}
