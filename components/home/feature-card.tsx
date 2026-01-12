import { cn } from '@/lib/cn';
import Link from 'next/link';
import type { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  href?: string;
  className?: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  href,
  className,
}: FeatureCardProps) {
  const content = (
    <div
      className={cn(
        'feature-card group relative p-6 rounded-xl',
        className
      )}
    >
      <div className="mb-4 inline-flex p-3 rounded-lg bg-fd-primary/10 text-fd-primary icon-glow">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2 text-fd-foreground group-hover:text-fd-primary transition-colors">
        {title}
      </h3>
      <p className="text-fd-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
      {href && (
        <span className="mt-4 inline-flex items-center text-sm text-fd-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          了解更多 →
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }
  return content;
}
