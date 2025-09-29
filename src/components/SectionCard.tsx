import type { PropsWithChildren, ReactNode } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

type SectionCardProps = PropsWithChildren<{
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}>;

const SectionCard = ({ title, description, action, className, children }: SectionCardProps) => {
  return (
    <motion.section
      layout
      initial={{ opacity: 0, translateY: 16 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={clsx(
        'rounded-3xl border border-white/5 bg-slate-900/60 p-6 shadow-glow backdrop-blur-xl',
        'ring-1 ring-white/5 hover:ring-white/10 transition-all duration-300',
        className,
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white sm:text-xl">{title}</h2>
          {description ? (
            <p className="mt-1 max-w-2xl text-sm text-slate-400 sm:text-base">{description}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      <div className="mt-6 space-y-4">{children}</div>
    </motion.section>
  );
};

export default SectionCard;
