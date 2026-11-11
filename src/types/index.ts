export type DimensionId = 'chamber' | 'forest' | 'cyberpunk' | 'cosmic' | 'underwater';

export type PortalState = 'dormant' | 'charging' | 'active' | 'transitioning';

export type AspectRatioMode = 'fullscreen' | '9:16' | '16:9';

export type QualityTier = 'low' | 'medium' | 'high';

export interface DimensionMetadata {
  id: DimensionId;
  name: string;
  tagline: string;
  palette: string[];
  ambientColor: string;
  fogColor: string;
  portalTint: string;
}

export const DIMENSIONS: Record<DimensionId, DimensionMetadata> = {
  chamber: {
    id: 'chamber',
    name: 'Ancient Nexus Room',
    tagline: 'The Forgotten Gateway of Aethelgard',
    palette: ['#00f2fe', '#7f00ff', '#2d1b69', '#ffd700'],
    ambientColor: '#0c0e1f',
    fogColor: '#050711',
    portalTint: '#00f2fe',
  },
  forest: {
    id: 'forest',
    name: 'The Enchanted Sylva',
    tagline: 'Bioluminescent Canopy & Sacred Falls',
    palette: ['#00f5d4', '#7b2cbf', '#05ffa1', '#ffd166'],
    ambientColor: '#031713',
    fogColor: '#020f0d',
    portalTint: '#00f5d4',
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Neo-Kowloon 2099',
    tagline: 'Megastructure Skyline & Rain-slick Corridors',
    palette: ['#ff007f', '#00f0ff', '#7928ca', '#ffe600'],
    ambientColor: '#09081a',
    fogColor: '#050412',
    portalTint: '#ff007f',
  },
  cosmic: {
    id: 'cosmic',
    name: 'Nebula Genesis',
    tagline: 'Stellar Nursery & The Void Heart',
    palette: ['#9d4edd', '#ff70a6', '#4cc9f0', '#ffbe0b'],
    ambientColor: '#070214',
    fogColor: '#03010a',
    portalTint: '#9d4edd',
  },
  underwater: {
    id: 'underwater',
    name: 'Abyssal Atlantis',
    tagline: 'Sunken Colosseum of the Deep',
    palette: ['#0077b6', '#48cae4', '#90e0ef', '#7209b7'],
    ambientColor: '#011627',
    fogColor: '#010d18',
    portalTint: '#00b4d8',
  },
};
