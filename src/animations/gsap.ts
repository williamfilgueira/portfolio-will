import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Media queries usadas nas animações (gsap.matchMedia / useMediaQuery). */
export const MQ = {
  motionOK: '(prefers-reduced-motion: no-preference)',
  reduce: '(prefers-reduced-motion: reduce)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
} as const;

/** Equivalentes GSAP das curvas do design system. */
export const gsapEase = {
  standard: 'power2.out',
  out: 'expo.out',
  in: 'power3.in',
  inOut: 'power3.inOut',
  pop: 'back.out(1.7)',
} as const;

export { gsap, ScrollTrigger, useGSAP };
