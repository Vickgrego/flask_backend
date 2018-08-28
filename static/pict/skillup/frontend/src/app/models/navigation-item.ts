import { NavigationActionType } from './navigation-action-type.enum'
import { Tag } from './tag'

export class NavigationItem {
  id: number;
  name: string;
  children: Array<NavigationItem>;
  tags: Array<any>;
  isActive: boolean;
  orderNumber: number;
  hasDescendants: boolean;
  navigationActionType: string;
  contentUrl: string;
  tagGroupId: number;
}
