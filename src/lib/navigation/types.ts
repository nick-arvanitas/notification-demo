import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Url } from 'next/dist/shared/lib/router/router';

export type NavItem = {
  name: string;
  icon: IconProp;
  href?: Url;
  current: boolean;
  parentTitle?: string;
  subpages?: NavItem[];
}
