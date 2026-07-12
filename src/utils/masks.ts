export function maskTelephone(value: string): string {
  let v = value.replace(/\D/g, '');
  v = v.replace(/^(\d{2})(\d)/, '($1) $2');
  v = v.replace(/(\d)(\d{4})$/, '$1-$2');
  return value;
}

export function maskDate(value: string): string {
  let v = value.replace(/\D/g, '');

  if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2, 6);

  return v;
}

export function onlyLetters(value: string): string {
  return value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
}
