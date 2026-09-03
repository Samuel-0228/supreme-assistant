import React, { useEffect, useRef } from 'react';

export interface ColorStop {
  hex: string;
  pos: number;
  r: number;
  g: number;
  b: number;
}

export interface RibbonGradientConfig {
  angle?: number;
  wave?: number;
  softness?: number;
  scale?: number;
  vignette?: number;
  grain?: number;
  animated?: boolean;
  speed?: number;
}

interface RibbonFieldCanvasProps extends RibbonGradientConfig {
  className?: string;
  style?: React.CSSProperties;
  interactive?: boolean;
  colorStops?: ColorStop[];
}

export const DEFAULT_MONOCHROME_COLOR_STOPS: ColorStop[] = [
  { hex: '#1E1E1E', pos: 0.40, r: 30,  g: 30,  b: 30  }, // Deep Charcoal Black
  { hex: '#E5E5E5', pos: 0.47, r: 229, g: 229, b: 229 }, // Off-White Highlight
  { hex: '#7F7F7F', pos: 0.50, r: 127, g: 127, b: 127 }, // Neutral Medium Gray
  { hex: '#0B0B0B', pos: 0.63, r: 11,  g: 11,  b: 11  }, // Pure Near-Black
  { hex: '#404040', pos: 1.00, r: 64,  g: 64,  b: 64  }  // Dark Slate Gray
];

export const RibbonFieldCanvas: React.FC<RibbonFieldCanvasProps> = ({
  angle = 135,
  wave = 12,
  softness = 26,
  scale = 68,
  vignette = 40,
  grain = 100,
  animated = true,
  speed = 20,
  className = '',
  style = {},
  interactive = false,
  colorStops = DEFAULT_MONOCHROME_COLOR_STOPS
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const clockRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth || 800;
      height = canvas.height = canvas.parentElement.clientHeight || 600;
    };

    window.addEventListener('resize', handleResize);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Fast 135deg Ribbon Field Canvas Pixel Renderer
    const render = () => {
      if (!ctx || !canvas) return;

      const w = canvas.width;
      const h = canvas.height;
      if (w === 0 || h === 0) return;

      // Downsampled resolution for 60fps performance
      const renderScale = 0.5;
      const rw = Math.max(1, Math.floor(w * renderScale));
      const rh = Math.max(1, Math.floor(h * renderScale));

      const imgData = ctx.createImageData(rw, rh);
      const data = imgData.data;

      const rad = (angle * Math.PI) / 180;
      const cosA = Math.cos(rad);
      const sinA = Math.sin(rad);

      const cx = rw / 2;
      const cy = rh / 2;
      const diag = Math.sqrt(rw * rw + rh * rh) || 1;

      const clock = clockRef.current;
      const waveAmp = (wave / 100) * 0.35;
      const soft = softness / 100;
      const vigPower = vignette / 100;

      for (let r = 0; r < rh; r++) {
        for (let c = 0; c < rw; c++) {
          const idx = (r * rw + c) * 4;

          const dx = c - cx;
          const dy = r - cy;

          // Normalized coordinates along ribbon diagonal
          const main = (dx * cosA + dy * sinA) / (diag * (scale / 100));
          const cross = (-dx * sinA + dy * cosA) / diag;

          // Ribbon sine wave bend math
          const bend = waveAmp * Math.sin(cross * 2.4 * 2 * Math.PI + clock);
          let pos = main + bend + 0.5;

          // Clamp position
          pos = Math.max(0, Math.min(1, pos));

          // Interpolate monochrome palette color stops
          let cr = colorStops[0].r;
          let cg = colorStops[0].g;
          let cb = colorStops[0].b;

          if (pos <= colorStops[0].pos) {
            cr = colorStops[0].r;
            cg = colorStops[0].g;
            cb = colorStops[0].b;
          } else if (pos >= colorStops[colorStops.length - 1].pos) {
            const last = colorStops[colorStops.length - 1];
            cr = last.r;
            cg = last.g;
            cb = last.b;
          } else {
            for (let i = 0; i < colorStops.length - 1; i++) {
              const s1 = colorStops[i];
              const s2 = colorStops[i + 1];
              if (pos >= s1.pos && pos <= s2.pos) {
                const t = (pos - s1.pos) / (s2.pos - s1.pos);
                const easedT = soft > 0 
                  ? t < 0.5 
                    ? Math.pow(t, 1 + soft * 2) * Math.pow(2, soft * 2)
                    : 1 - Math.pow(1 - t, 1 + soft * 2) * Math.pow(2, soft * 2)
                  : t;

                cr = Math.round(s1.r + (s2.r - s1.r) * easedT);
                cg = Math.round(s1.g + (s2.g - s1.g) * easedT);
                cb = Math.round(s1.b + (s2.b - s1.b) * easedT);
                break;
              }
            }
          }

          // Subtle Vignette Falloff
          if (vigPower > 0) {
            const distFromCenter = Math.sqrt(dx * dx + dy * dy) / (diag * 0.5);
            const vig = Math.max(0, 1 - distFromCenter * vigPower * 0.8);
            cr = Math.round(cr * vig);
            cg = Math.round(cg * vig);
            cb = Math.round(cb * vig);
          }

          // Noise Grain
          if (grain > 0) {
            const noise = (Math.random() - 0.5) * (grain * 0.18);
            cr = Math.min(255, Math.max(0, cr + noise));
            cg = Math.min(255, Math.max(0, cg + noise));
            cb = Math.min(255, Math.max(0, cb + noise));
          }

          data[idx] = cr;
          data[idx + 1] = cg;
          data[idx + 2] = cb;
          data[idx + 3] = 255;
        }
      }

      // Draw downsampled canvas buffer scaled to container
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = rw;
      tempCanvas.height = rh;
      const tempCtx = tempCanvas.getContext('2d');
      if (tempCtx) {
        tempCtx.putImageData(imgData, 0, 0);
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(tempCanvas, 0, 0, w, h);
      }

      if (animated && !prefersReducedMotion) {
        clockRef.current += speed * 0.0003;
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [angle, wave, softness, scale, vignette, grain, animated, speed, colorStops]);

  return (
    <div 
      className={`relative w-full h-full overflow-hidden pointer-events-none select-none ${className}`}
      style={style}
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full object-cover pointer-events-none"
      />
    </div>
  );
};

export default RibbonFieldCanvas;
