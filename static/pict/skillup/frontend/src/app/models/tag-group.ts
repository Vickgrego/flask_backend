import { Tag } from './tag'

export class TagGroup {
  id: number;
  name: string;
  tags: Array<Tag> = new Array();
  orderNumber: number;
}
