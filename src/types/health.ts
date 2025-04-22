
export interface Symptom {
  id: string;
  name: string;
  severity: number;
  notes: string;
  date: string; // ISO string
  createdAt: string; // ISO string
}

export interface SymptomFormData {
  name: string;
  severity: number;
  notes: string;
  date: string;
}
