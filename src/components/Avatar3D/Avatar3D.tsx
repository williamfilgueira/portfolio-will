import { useEffect, useRef } from 'react';
import { createBustRenderer, createImageRenderer, type Renderer } from './renderers';
import { gsap, ScrollTrigger, useGSAP } from '@/animations/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/cn';

/*
 * Avatar do hero.
 *
 * Coloque a imagem do seu avatar (PNG com fundo transparente) em  src/assets/avatar.png
 * — ou .webp / .jpg — e ela entra sozinha, sem mexer em código:
 *   repouso: avatar flutuando, inclinando em 3D com o cursor e com luz âmbar varrendo
 *   scroll:  gira um pouco e se desfaz em partículas âmbar que sobem ("dissolve")
 * Sem imagem, aparece o busto em nuvem de pontos.
 * Pausa fora da tela e fica estático com "menos movimento".
 */

const avatarFiles = import.meta.glob<string>('/src/assets/avatar.{png,webp,jpg,jpeg}', {
  eager: true,
  query: '?url',
  import: 'default',
});
const AVATAR_URL: string | undefined = Object.values(avatarFiles)[0];

type Avatar3DProps = {
  className?: string;
};

export function Avatar3D({ className }: Avatar3DProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dissolve = useRef(0);
  const reduced = useReducedMotion();

  // Progresso do "dissolve" ligado à posição do próprio avatar (scrub 1:1):
  // começa quando o topo dele chega a 15% da tela e termina quando ele sai por cima.
  // Assim funciona igual no desktop (avatar ao lado do texto) e no mobile (abaixo do texto).
  useGSAP(
    () => {
      const wrap = wrapRef.current;
      if (reduced || !wrap) return;
      const range = { trigger: wrap, start: 'top 15%', end: 'bottom top', scrub: true } as const;

      ScrollTrigger.create({
        ...range,
        onUpdate: (self) => {
          dissolve.current = self.progress;
        },
      });

      gsap.to(wrap.querySelectorAll('[data-ring]'), {
        scale: 1.3,
        autoAlpha: 0,
        ease: 'none',
        stagger: 0.08,
        scrollTrigger: range,
      });
    },
    { dependencies: [reduced], scope: wrapRef, revertOnUpdate: true },
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let renderer: Renderer | null = AVATAR_URL ? null : createBustRenderer();
    let isImage = false;
    let cancelled = false;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    let width = 1;
    let height = 1;
    let dpr = 1;
    let raf = 0;
    let visible = false;

    const draw = (now: number) => {
      if (!renderer) return;
      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;
      const s = reduced ? 0 : dissolve.current;

      renderer(ctx, {
        now,
        dissolve: s,
        px: pointer.x,
        py: pointer.y,
        reduced,
        width,
        height,
        dpr,
      });

      // No modo imagem, a "rotação 3D" é uma inclinação em perspectiva do próprio canvas.
      if (isImage && !reduced) {
        const rotY = pointer.x * 7 + s * 22;
        const rotX = -pointer.y * 5;
        canvas.style.transform = `perspective(1100px) rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg)`;
      }
    };

    const loop = (now: number) => {
      draw(now);
      raf = requestAnimationFrame(loop);
    };
    const play = () => {
      if (reduced || raf) return;
      raf = requestAnimationFrame(loop);
    };
    const pause = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.round(rect.width * dpr));
      height = Math.max(1, Math.round(rect.height * dpr));
      canvas.width = width;
      canvas.height = height;
      if (!raf) draw(performance.now());
    };

    if (AVATAR_URL) {
      const img = new Image();
      img.decoding = 'async';
      img.src = AVATAR_URL;
      img
        .decode()
        .then(() => {
          if (cancelled) return;
          renderer = createImageRenderer(img);
          isImage = true;
          if (!raf) draw(performance.now());
        })
        .catch(() => {
          if (cancelled) return;
          renderer = createBustRenderer();
          if (!raf) draw(performance.now());
        });
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const intersection = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !document.hidden) play();
        else pause();
      },
      { rootMargin: '120px' },
    );
    intersection.observe(canvas);

    const onVisibility = () => {
      if (document.hidden) pause();
      else if (visible) play();
    };
    const onPointer = (event: PointerEvent) => {
      pointer.tx = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.ty = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    document.addEventListener('visibilitychange', onVisibility);
    if (!reduced) window.addEventListener('pointermove', onPointer, { passive: true });
    resize();

    return () => {
      cancelled = true;
      pause();
      resizeObserver.disconnect();
      intersection.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onPointer);
    };
  }, [reduced]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={cn(
        'relative isolate aspect-square w-full overflow-hidden rounded-[28px] bg-graphite shadow-lift',
        className,
      )}
    >
      <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(rgb(255_176_32/0.14)_1px,transparent_1px)] [background-size:22px_22px]" />
      <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_62%_40%,rgb(255_176_32/0.14),transparent_70%)]" />

      {/* Moldura em X do conceito (●──● ╲╱ FACE ╱╲ ●──●) */}
      <svg
        data-ring
        viewBox="0 0 100 100"
        className="absolute top-[9%] left-[9%] h-[82%] w-[82%] overflow-visible"
        fill="none"
      >
        <path
          d="M8 8 H92 M8 92 H92 M8 8 L92 92 M92 8 L8 92"
          stroke="rgb(255 176 32 / 0.13)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        {[
          [8, 8],
          [92, 8],
          [8, 92],
          [92, 92],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1.1" fill="#ffb020" />
        ))}
      </svg>

      {/* Brilho suave atrás da cabeça + anel fino (halo) */}
      <div
        data-ring
        className="absolute top-[40%] left-1/2 size-[56%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_176_32/0.12),transparent)]"
      />
      <div
        data-ring
        className="absolute top-[50%] left-1/2 size-[82%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/10"
      />

      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full will-change-transform" />

      <span className="absolute top-5 left-6 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-ink-dim">
        01 / Face
      </span>
    </div>
  );
}
