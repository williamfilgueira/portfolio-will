import { useMediaQuery } from './useMediaQuery';

/** true quando o usuário pediu menos movimento no sistema operacional. */
export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
