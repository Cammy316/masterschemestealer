"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from '@/components/ShoppingCart';

interface ForgeRequisitionTabProps {
  manifestId: string;
}

export default function ForgeRequisitionTab({ manifestId }: ForgeRequisitionTabProps) {
  return (
    <motion.div key="requisition" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6 mt-8">
      <ShoppingCart manifestId={manifestId} />
    </motion.div>
  );
}
