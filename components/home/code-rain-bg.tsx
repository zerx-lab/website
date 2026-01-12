'use client';

import { useEffect, useRef } from 'react';

interface FloatingText {
  text: string;
  x: number;
  y: number;
  opacity: number;
  progress: number;
  lifetime: number;
  fadeIn: boolean;
  fontSize: number;
}

const codeSnippets = [
  'const app = create()',
  'async function main()',
  'export default App',
  'import { useState }',
  'return <Component />',
  'type Props = {}',
  'interface Config {}',
  'await fetch(url)',
  'npm install next',
  'git commit -m "feat"',
  'docker compose up',
  'bun run dev',
  'pnpm build',
  'tsx index.ts',
  'fn main() -> Result',
  'impl Trait for T',
  'struct Config {}',
  'pub async fn run()',
  '#[derive(Debug)]',
  'use std::sync::Arc',
  'SELECT * FROM users',
  'INSERT INTO logs',
  'CREATE TABLE posts',
  'JOIN ON id = ref',
  '.filter(x => x > 0)',
  '.map(fn).reduce()',
  'Promise.all(tasks)',
  'try { } catch (e)',
  'if err != nil {}',
  'match result {}',
  '<div className="">',
  'useEffect(() => {})',
  'useState<T>(init)',
  'useMemo(() => val)',
  '@tailwind base;',
  'flex items-center',
  'grid grid-cols-3',
  'dark:bg-zinc-900',
  'hover:scale-105',
  'transition-all',
  'console.log(data)',
  'JSON.stringify(obj)',
  'Object.keys(obj)',
  'Array.from(set)',
  'new Map<K, V>()',
  'Set.prototype.has',
  'RegExp.test(str)',
  'Date.now()',
  'Math.random()',
  'crypto.randomUUID()',
];

export function CodeRainBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const textsRef = useRef<FloatingText[]>([]);
  const lastTimeRef = useRef<number>(0);
  const lastSpawnRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const getRandomPosition = (): [number, number] => {
      const cols = 4;
      const rows = 4;
      const cellWidth = window.innerWidth / cols;
      const cellHeight = window.innerHeight / rows;
      
      const col = Math.floor(Math.random() * cols);
      const row = Math.floor(Math.random() * rows);
      
      const x = col * cellWidth + cellWidth * 0.2 + Math.random() * cellWidth * 0.6;
      const y = row * cellHeight + cellHeight * 0.2 + Math.random() * cellHeight * 0.6;
      
      return [x, y];
    };

    const spawnText = () => {
      if (textsRef.current.length >= 6) return;
      
      const text = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
      const [x, y] = getRandomPosition();
      const fontSize = 14 + Math.random() * 4;
      
      textsRef.current.push({
        text,
        x,
        y,
        opacity: 0,
        progress: 0,
        lifetime: 0,
        fadeIn: true,
        fontSize,
      });
    };

    spawnText();
    setTimeout(spawnText, 500);

    const animate = (currentTime: number) => {
      if (!ctx) return;
      
      const deltaTime = lastTimeRef.current ? (currentTime - lastTimeRef.current) / 1000 : 0.016;
      lastTimeRef.current = currentTime;

      if (currentTime - lastSpawnRef.current > 2000) {
        spawnText();
        lastSpawnRef.current = currentTime;
      }

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      textsRef.current = textsRef.current.filter(item => {
        item.lifetime += deltaTime;

        if (item.fadeIn && item.opacity < 0.35) {
          item.opacity = Math.min(0.35, item.opacity + deltaTime * 0.5);
        }

        if (item.progress < 1) {
          item.progress = Math.min(1, item.progress + deltaTime * 0.4);
        }

        if (item.lifetime > 5) {
          item.fadeIn = false;
          item.opacity = Math.max(0, item.opacity - deltaTime * 0.2);
        }

        if (item.lifetime > 8) {
          return false;
        }

        const charsToShow = Math.floor(item.text.length * item.progress);
        const displayText = item.text.slice(0, charsToShow);

        ctx.save();
        ctx.font = `${item.fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, monospace`;
        ctx.fillStyle = `rgba(59, 130, 246, ${item.opacity})`;
        
        const yOffset = Math.sin(item.lifetime * 0.5) * 2;
        ctx.fillText(displayText, item.x, item.y + yOffset);
        
        ctx.restore();

        return true;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
