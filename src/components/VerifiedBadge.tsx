import { motion } from 'motion/react';
import { Check } from 'lucide-react';

export default function VerifiedBadge({ className }: { className?: string }) {
  return (
    <motion.div 
      animate={{ 
        boxShadow: ['0 0 0px rgba(105,201,208,0)', '0 0 10px rgba(105,201,208,0.5)', '0 0 0px rgba(105,201,208,0)'] 
      }}
      transition={{ duration: 5, repeat: Infinity }}
      className={`relative inline-flex items-center justify-center ${className}`}
      title="Verified Account"
    >
      <svg viewBox="0 0 24 24" className="w-full h-full fill-[#69C9D0] drop-shadow-[0_0_5px_rgba(105,201,208,0.8)]">
        <path d="M12 1L9.69 2.58L7 2.14L5.62 4.41L3.11 4.75L2.83 7.28L1 9.17L2.1 11.5L1 13.83L2.83 15.72L3.11 18.25L5.62 18.59L7 20.86L9.69 20.42L12 22L14.31 20.42L17 20.86L18.38 18.59L20.89 18.25L21.17 15.72L23 13.83L21.9 11.5L23 9.17L21.17 7.28L20.89 4.75L18.38 4.41L17 2.14L14.31 2.58L12 1Z" />
      </svg>
      <Check className="absolute w-[60%] h-[60%] text-white stroke-[4]" />
    </motion.div>
  );
}
