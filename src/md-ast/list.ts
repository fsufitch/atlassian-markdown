import { ASTNode } from "./base";

export const BULLET_LIST_OPEN = 'bullet_list_open'
export const BULLET_LIST_CLOSE = 'bullet_list_close'
export const ORDERED_LIST_OPEN = 'ordered_list_open'
export const ORDERED_LIST_CLOSE = 'ordered_list_close'
export const LIST_ITEM_OPEN = 'list_item_open'
export const LIST_ITEM_CLOSE = 'list_item_close'

export class BulletListNode extends ASTNode {
    checkOpen = [BULLET_LIST_OPEN];
    checkClose = [BULLET_LIST_CLOSE];
    toAtlassian(): string {
        return "";
    }
    toHTML(): string {
        return "";
    }
}
export class OrderedListNode extends ASTNode {
    checkOpen = [ORDERED_LIST_OPEN];
    checkClose = [ORDERED_LIST_CLOSE];
    toAtlassian(): string {
        return "";
    }
    toHTML(): string {
        return "";
    }
}

export class ListItemNode extends ASTNode {
    checkOpen = [LIST_ITEM_OPEN];
    checkClose = [LIST_ITEM_CLOSE];
    toAtlassian(): string {
        return "";
    }
    toHTML(): string {
        return "";
    }
}

