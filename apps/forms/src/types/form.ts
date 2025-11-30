// FluentForm field types based on analysis
export type FormFieldType = 
  | 'input_hidden'
  | 'input_text' 
  | 'input_email'
  | 'input_radio'
  | 'input_checkbox'
  | 'input_file'
  | 'textarea'
  | 'select'
  | 'custom_html'
  | 'fcal_booking';

export interface FormFieldAttributes {
  type?: string;
  name?: string;
  value?: string | string[];
  placeholder?: string;
  required?: boolean;
  class?: string;
  id?: string;
  accept?: string;
  maxlength?: string | number;
  [key: string]: any; // Allow additional properties
}

export interface FormFieldSettings {
  admin_field_label?: string;
  label?: string;
  help_message?: string;
  validation_rules?: Record<string, any>;
  container_class?: string;
  label_placement?: string;
  dynamic_default_value?: string;
  [key: string]: any; // Allow additional properties
}

export interface FormFieldEditorOptions {
  title: string;
  icon_class?: string;
  template?: string;
  element?: string;
  [key: string]: any; // Allow additional properties
}

export interface FormFieldStylePref {
  layout?: string;
  media?: string;
  brightness?: number;
  alt_text?: string;
  media_x_position?: number;
  media_y_position?: number;
}

export interface FormField {
  index: number;
  element: FormFieldType;
  attributes: FormFieldAttributes;
  settings: FormFieldSettings;
  editor_options: FormFieldEditorOptions;
  style_pref?: FormFieldStylePref;
  uniqElKey: string;
  options?: Record<string, string>; // For radio/checkbox/select options
}

export interface FormFields {
  fields: FormField[];
}

export interface FluentForm {
  id: number;
  title: string;
  status: 'published' | 'draft';
  appearance_settings?: any;
  form_fields: FormFields;
  has_payment?: boolean;
  type?: string;
  conditions?: any[];
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  form_meta?: Record<string, any>;
  metas?: Record<string, any>;
}

export interface FormSubmissionData {
  [fieldName: string]: string | string[] | File | File[];
}

export interface FormState {
  data: FormSubmissionData;
  errors: Record<string, string>;
  isSubmitting: boolean;
  currentStep?: number;
  totalSteps?: number;
}
