'use client';

import { useEffect, useRef } from 'react';

interface WolaiContentProps {
  html: string;
}

export function WolaiContent({ html }: WolaiContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const codeBlocks = containerRef.current.querySelectorAll('figure.code-block');

    codeBlocks.forEach((block) => {
      // 检查是否已经添加过按钮
      if (block.querySelector('.copy-button')) return;

      const header = block.querySelector('.code-header');
      if (!header) return;

      const button = document.createElement('button');
      button.className = 'copy-button ml-auto p-1.5 rounded transition-colors';
      button.innerHTML = `
        <svg class="copy-icon w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <svg class="check-icon w-4 h-4 hidden text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      `;

      button.addEventListener('click', async () => {
        const code = block.querySelector('code');
        if (!code) return;

        try {
          await navigator.clipboard.writeText(code.textContent || '');

          const copyIcon = button.querySelector('.copy-icon');
          const checkIcon = button.querySelector('.check-icon');

          copyIcon?.classList.add('hidden');
          checkIcon?.classList.remove('hidden');

          setTimeout(() => {
            copyIcon?.classList.remove('hidden');
            checkIcon?.classList.add('hidden');
          }, 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
        }
      });

      header.appendChild(button);
    });
  }, [html]);

  return (
    <div ref={containerRef} dangerouslySetInnerHTML={{ __html: html }} />
  );
}
