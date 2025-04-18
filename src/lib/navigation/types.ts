import { IconProp } from '@fortawesome/fontawesome-svg-core';

export interface NavItem {
  name: string;
  href: string;
  icon: IconProp;
  current: boolean;
}

export interface SubpageConfig {
  name: string;
  icon: IconProp;
  subpages?: {
    [key: string]: SubpageConfig;
  };
}

export interface SectionConfig {
  name: string;
  icon: IconProp;
  subpages?: {
    [key: string]: SubpageConfig;
  };
} 