import { Recycle, Package, Droplets, Leaf, CircuitBoard, Sparkles } from 'lucide-react'
import type { WasteType } from '@/types'

/**
 * Waste categories with their associated Lucide icon and point rate.
 * ptsPerKg is used by MobileApp.logDeposit to calculate earned points.
 */
export const WASTE_TYPES: {
  name: WasteType
  icon: typeof Recycle
  ptsPerKg: number
}[] = [
  { name: 'Plastic',  icon: Recycle,       ptsPerKg: 30  },
  { name: 'Paper',    icon: Package,       ptsPerKg: 15  },
  { name: 'Glass',    icon: Droplets,      ptsPerKg: 14  },
  { name: 'Organic',  icon: Leaf,          ptsPerKg: 10  },
  { name: 'E-waste',  icon: CircuitBoard,  ptsPerKg: 120 },
  { name: 'Other',    icon: Sparkles,      ptsPerKg: 10  },
]