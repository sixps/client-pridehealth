'use client';

import { motion } from 'motion/react';
import { FormField } from '@/types/form';

interface CustomHTMLProps {
  field: FormField;
}

export function CustomHTML({ field }: CustomHTMLProps) {
  const { settings } = field;
  const content = settings.label || '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="prose prose-sm max-w-none dark:prose-invert"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
