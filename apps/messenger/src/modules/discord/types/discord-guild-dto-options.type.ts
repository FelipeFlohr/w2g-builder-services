export type DiscordGuildDTOOptions = {
  readonly applicationId?: string;
  readonly memberCount: number;
  readonly available: boolean;
  readonly createdAt: Date;
  readonly id: string;
  readonly joinedAt: Date;
  readonly ownerId: string;
  readonly name: string;
  readonly large: boolean;
};
