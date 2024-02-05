import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration51706976795330 implements MigrationInterface {
  name = "Migration51706976795330";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "TB_DISCORD_MESSAGE" DROP CONSTRAINT "FK_9f6e8167d55d903b8dfd18e9615"`);
    await queryRunner.query(
      `ALTER TABLE "TB_DISCORD_MESSAGE" ADD CONSTRAINT "FK_9f6e8167d55d903b8dfd18e9615" FOREIGN KEY ("DME_DMAID") REFERENCES "TB_DISCORD_MESSAGE_AUTHOR"("DMA_ID") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "TB_DISCORD_MESSAGE" DROP CONSTRAINT "FK_9f6e8167d55d903b8dfd18e9615"`);
    await queryRunner.query(
      `ALTER TABLE "TB_DISCORD_MESSAGE" ADD CONSTRAINT "FK_9f6e8167d55d903b8dfd18e9615" FOREIGN KEY ("DME_DMAID") REFERENCES "TB_DISCORD_MESSAGE_AUTHOR"("DMA_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
