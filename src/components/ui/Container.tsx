import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/cn';

type ContainerProps = ComponentPropsWithoutRef<'div'>;

/** Largura máxima do conteúdo (1280px) com margens laterais fluidas. */
export function Container({ className, ...rest }: ContainerProps) {
  return <div className={cn('container-site', className)} {...rest} />;
}
