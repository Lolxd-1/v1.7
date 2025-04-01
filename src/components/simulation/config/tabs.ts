import { Sparkles, Scale, Zap } from 'lucide-react';

export const tabs = [
  {
    id: 'optimistic',
    label: 'Optimistic',
    icon: Sparkles,
    color: 'from-green-500/20 to-emerald-500/20',
    borderColor: 'border-green-500/50',
    iconColor: 'text-green-400',
    bgGradient: 'from-green-500/10 to-emerald-500/10',
    borderGradient: 'border-green-500/30'
  },
  {
    id: 'neutral',
    label: 'Neutral',
    icon: Scale,
    color: 'from-yellow-500/20 to-amber-500/20',
    borderColor: 'border-yellow-500/50',
    iconColor: 'text-yellow-400',
    bgGradient: 'from-yellow-500/10 to-amber-500/10',
    borderGradient: 'border-yellow-500/30'
  },
  {
    id: 'disruptive',
    label: 'Disruptive',
    icon: Zap,
    color: 'from-red-500/20 to-rose-500/20',
    borderColor: 'border-red-500/50',
    iconColor: 'text-red-400',
    bgGradient: 'from-red-500/10 to-rose-500/10',
    borderGradient: 'border-red-500/30'
  }
] as const;