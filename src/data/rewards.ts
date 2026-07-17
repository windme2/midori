import { Utensils, Coffee, ShoppingBag, Leaf, Droplets, Tag } from 'lucide-react'
import type { Reward } from '@/types'

/**
 * Reward marketplace items.
 * accentColor drives the card's decorative gradient.
 * cost is a plain number for arithmetic comparisons against the user's balance.
 */
export const REWARDS: Reward[] = [
  {
    id: 1,
    name: 'Bamboo Utensil Kit',
    cost: 1200,
    description: 'Lightweight set with cloth pouch — perfect for on-the-go meals.',
    icon: Utensils,
    accentColor: '#A8845A',
    category: 'Merchandise',
  },
  {
    id: 2,
    name: 'Coffee Shop Voucher',
    cost: 900,
    description: 'Valid at 50+ participating cafés across the city.',
    icon: Coffee,
    accentColor: '#7C5A3A',
    category: 'Vouchers',
  },
  {
    id: 3,
    name: 'Eco Tote Bag',
    cost: 600,
    description: 'Durable organic cotton bag for daily errands.',
    icon: ShoppingBag,
    accentColor: '#5F7A61',
    category: 'Merchandise',
  },
  {
    id: 4,
    name: 'Plant a Tree',
    cost: 300,
    description: 'Support local reforestation projects in your area.',
    icon: Leaf,
    accentColor: '#3D8050',
    category: 'Donations',
  },
  {
    id: 5,
    name: 'Organic Soap Set',
    cost: 450,
    description: 'Handcrafted with natural botanicals. Zero plastic packaging.',
    icon: Droplets,
    accentColor: '#8B7B9E',
    category: 'Merchandise',
  },
  {
    id: 6,
    name: 'Local Market Voucher',
    cost: 750,
    description: '฿50 credit at your nearest certified green market.',
    icon: Tag,
    accentColor: '#C46B3A',
    category: 'Vouchers',
  },
]
