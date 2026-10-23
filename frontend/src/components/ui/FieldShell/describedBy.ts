/** Valor para aria-describedby según lo que se esté mostrando bajo el campo. */
export function describedBy(id: string, error?: string, hint?: string) {
  return error ? `${id}-error` : hint ? `${id}-hint` : undefined
}
