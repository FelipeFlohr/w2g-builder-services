import { DiscordParentCategory } from "../discord-parent-category";
import { DiscordJsParentCategoryOptions } from "./types/discord-js-parent-category-options.type";

export class DiscordJsParentCategoryImpl implements DiscordParentCategory {
  public readonly id: string;
  public readonly name: string;

  public constructor(options: DiscordJsParentCategoryOptions) {
    this.id = options.id;
    this.name = options.name;
  }
}
