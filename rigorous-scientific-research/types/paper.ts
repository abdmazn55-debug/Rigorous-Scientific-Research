
export interface Paper {
  id: string; title: string; authors: {name:string}[]; abstract?: string;
  year?: number; citations?: number; doi?: string; pdfUrl?: string;
  source: 'openalex'|'semanticscholar'|'arxiv'|'pubmed'|'core';
  isOpenAccess: boolean; journal?: string; fields?: string[]; url?: string;
}
