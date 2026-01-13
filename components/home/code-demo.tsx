'use client';

import { cn } from '@/lib/cn';
import { Check, Copy, Github, ExternalLink, Terminal } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

const tabs = [
  {
    name: 'about.ts',
    content: `const developer = {
  name: "zerx",
  site: "zerx.dev",
  role: "Full Stack Developer",
  
  skills: {
    languages: ["TypeScript", "Rust", "Python"],
    frontend: ["React", "Next.js", "Tailwind"],
    backend: ["Node.js", "Hono", "PostgreSQL"],
    devops: ["Docker", "K8s", "GitHub Actions"]
  },
  
  focus: "Building modern web applications",
  github: "github.com/zerx-lab"
};

export default developer;`,
  },
  {
    name: 'stack.ts',
    content: `import { createStack } from "@zerx/toolkit";

const stack = createStack({
  framework: "Next.js 16",
  runtime: "Bun",
  styling: "Tailwind CSS",
  database: "PostgreSQL + Drizzle",
  auth: "Better Auth",
  deploy: "Vercel / Docker",
});

// 现代全栈开发技术栈
// TypeScript 优先，类型安全
// 追求性能与开发体验的平衡

export { stack };`,
  },
];

export function CodeDemo({ className }: { className?: string }) {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(tabs[activeTab].content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const syntaxHighlight = (code: string) => {
    return code.split('\n').map((line, lineIdx) => {
      const tokens: React.ReactNode[] = [];
      let remaining = line;

      if (remaining.includes('//')) {
        const parts = remaining.split('//');
        remaining = parts[0];
        tokens.push(
          <span key={`comment-${lineIdx}`} className="text-gray-400 dark:text-zinc-500">
            //{parts.slice(1).join('//')}
          </span>
        );
      }

      const keywords = ['const', 'import', 'export', 'from', 'default'];
      keywords.forEach((kw) => {
        const regex = new RegExp(`\\b${kw}\\b`, 'g');
        remaining = remaining.replace(regex, `__KW_${kw}__`);
      });

      const parts = remaining.split(/(__KW_\w+__)/g);
      parts.forEach((part, idx) => {
        if (part.startsWith('__KW_') && part.endsWith('__')) {
          const keyword = part.slice(5, -2);
          tokens.unshift(
            <span key={`kw-${lineIdx}-${idx}`} className="text-purple-600 dark:text-purple-400">
              {keyword}
            </span>
          );
        } else {
          const stringified = part.replace(
            /(["'`])([^"'`]*)\1/g,
            '<STRING>$1$2$1</STRING>'
          );
          const stringParts = stringified.split(/(<STRING>.*?<\/STRING>)/g);
          stringParts.forEach((sp, spIdx) => {
            if (sp.startsWith('<STRING>') && sp.endsWith('</STRING>')) {
              const content = sp.slice(8, -9);
              tokens.unshift(
                <span key={`str-${lineIdx}-${idx}-${spIdx}`} className="text-green-600 dark:text-green-400">
                  {content}
                </span>
              );
            } else {
              const propParts = sp.split(/(\w+)(?=:)/g);
              propParts.forEach((pp, ppIdx) => {
                if (/^\w+$/.test(pp) && propParts[ppIdx + 1]?.startsWith(':')) {
                  tokens.unshift(
                    <span key={`prop-${lineIdx}-${idx}-${spIdx}-${ppIdx}`} className="text-blue-600 dark:text-blue-300">
                      {pp}
                    </span>
                  );
                } else {
                  tokens.unshift(
                    <span key={`txt-${lineIdx}-${idx}-${spIdx}-${ppIdx}`} className="text-gray-700 dark:text-zinc-300">
                      {pp}
                    </span>
                  );
                }
              });
            }
          });
        }
      });

      return (
        <div key={lineIdx} className="leading-6">
          {tokens.reverse()}
        </div>
      );
    });
  };

  return (
    <div
      className={cn(
        'rounded-xl overflow-hidden bg-white dark:bg-[hsl(220,13%,10%)] border border-gray-200 dark:border-white/10',
        className
      )}
    >
      <div className="bg-gray-50 dark:bg-[hsl(220,13%,12%)] border-b border-gray-200 dark:border-white/10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
            
            <div className="flex items-center ml-4">
              {tabs.map((tab, idx) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(idx)}
                  className={cn(
                    'px-3 py-1.5 text-sm font-mono rounded transition-colors',
                    activeTab === idx
                      ? 'text-cyan-600 dark:text-zinc-200 bg-white dark:bg-white/10'
                      : 'text-gray-500 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300'
                  )}
                >
                  {tab.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200 transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-500 dark:text-green-400" />
                  <span className="text-green-500 dark:text-green-400">已复制</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>复制</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 overflow-x-auto min-h-[320px] bg-gray-50 dark:bg-[hsl(220,13%,10%)]">
        <pre className="text-[13px] font-mono">
          <code>{syntaxHighlight(tabs[activeTab].content)}</code>
        </pre>
      </div>

      <div className="border-t border-gray-200 dark:border-[var(--code-border)] px-4 py-3 flex items-center justify-between bg-gray-50 dark:bg-[hsl(220,13%,9%)]">
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-zinc-500">
          <Terminal className="w-3.5 h-3.5" />
          <span>TypeScript</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="https://github.com/zerx-lab"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200 transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </Link>
          <Link
            href="/docs"
            className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>文档</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
