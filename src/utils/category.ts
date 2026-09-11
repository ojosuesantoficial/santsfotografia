export function normalizeCategory(val?: string | null): string {
  if (!val) return '';
  return val
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function matchCategory(catA?: string | null, catB?: string | null): boolean {
  if (!catA || !catB) return false;
  const a = normalizeCategory(catA);
  const b = normalizeCategory(catB);
  if (a === 'all' || a === 'todos' || b === 'all' || b === 'todos') return true;
  return a === b || a.includes(b) || b.includes(a);
}

export function formatCategoryLabel(cat?: string | null): string {
  if (!cat) return '';
  const trimmed = cat.trim();
  const norm = normalizeCategory(trimmed);
  if (norm === 'aniversario') return 'Aniversário';
  if (norm === 'turismo') return 'Turismo';
  if (norm === 'casal') return 'Casal';
  if (norm === 'profissional') return 'Profissional';
  if (norm === 'infantil') return 'Infantil';
  if (norm === 'fitness') return 'Fitness';
  if (norm === 'moda') return 'Moda';
  if (norm === 'casamento') return 'Casamento';
  if (norm === 'formatura') return 'Formatura';
  if (norm === 'gestante') return 'Gestante';
  if (norm === 'familia') return 'Família';
  if (norm === 'pets') return 'Pets';
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}
