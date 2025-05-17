export interface KeyClause {
  clauseType: string;
  clauseText: string;
  justification: string;
}

export interface ProcessedDocument {
  id: string;
  name: string;
  originalText: string;
  summary: string;
  keyClauses: KeyClause[];
  uploadedAt: string; // ISO string date
}
