export interface KeyClause {
  clauseType: string;
  clauseText: string;
  justification: string;
}

export interface ProcessedDocument {
  id: string;
  name: string;
  originalText: string;
  summaryPoints: string[]; // Changed from summary: string
  keyClauses: KeyClause[];
  uploadedAt: string; // ISO string date
}
