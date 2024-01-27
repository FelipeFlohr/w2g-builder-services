import { DiscordListenerRepository } from "./discord-listener.repository";

export interface DiscordListenerCacheRepository
  extends DiscordListenerRepository {}

export const DiscordListenerCacheRepository = Symbol(
  "DiscordListenerCacheRepository",
);
