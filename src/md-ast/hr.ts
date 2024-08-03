import { SelfClosingNode } from "./base";

export const HR = 'hr';

export class HorizontalRuleNode extends SelfClosingNode {
  checkOpen = [HR];
  toAtlassian(): string {
    return "";
  }
  toHTML(): string {
    return "";
  }
}
