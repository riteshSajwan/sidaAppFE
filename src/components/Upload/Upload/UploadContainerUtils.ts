// ─── Dropdown option type ────────────────────────────────────────────────────
export interface IOption {
  label: string;
  value: string;
}

// ─── Local state shape ───────────────────────────────────────────────────────
export interface IUploadFormState {
  category: IOption;
  subCategory: IOption;
  fileType: IOption;
}
