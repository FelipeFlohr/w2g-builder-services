import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration41706220115643 implements MigrationInterface {
  name = "Migration41706220115643";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "TB_DISCORD_MESSAGE_AUTHOR" DROP CONSTRAINT "FK_b9007ae76cc129235140b867a78"`,
    );
    await queryRunner.query(
      `ALTER TABLE "TB_DISCORD_MESSAGE_AUTHOR" DROP CONSTRAINT "UQ_b9007ae76cc129235140b867a78"`,
    );
    await queryRunner.query(
      `ALTER TABLE "TB_DISCORD_MESSAGE_AUTHOR" DROP COLUMN "DMA_DMEID"`,
    );
    await queryRunner.query(
      `ALTER TABLE "TB_DISCORD_MESSAGE" DROP CONSTRAINT "FK_9f6e8167d55d903b8dfd18e9615"`,
    );
    await queryRunner.query(
      `ALTER TABLE "TB_DISCORD_MESSAGE" ALTER COLUMN "DME_DMAID" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "TB_DISCORD_MESSAGE" ADD CONSTRAINT "FK_9f6e8167d55d903b8dfd18e9615" FOREIGN KEY ("DME_DMAID") REFERENCES "TB_DISCORD_MESSAGE_AUTHOR"("DMA_ID") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "TB_DISCORD_MESSAGE" DROP CONSTRAINT "FK_9f6e8167d55d903b8dfd18e9615"`,
    );
    await queryRunner.query(
      `ALTER TABLE "TB_DISCORD_MESSAGE" ALTER COLUMN "DME_DMAID" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "TB_DISCORD_MESSAGE" ADD CONSTRAINT "FK_9f6e8167d55d903b8dfd18e9615" FOREIGN KEY ("DME_DMAID") REFERENCES "TB_DISCORD_MESSAGE_AUTHOR"("DMA_ID") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "TB_DISCORD_MESSAGE_AUTHOR" ADD "DMA_DMEID" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "TB_DISCORD_MESSAGE_AUTHOR" ADD CONSTRAINT "UQ_b9007ae76cc129235140b867a78" UNIQUE ("DMA_DMEID")`,
    );
    await queryRunner.query(
      `ALTER TABLE "TB_DISCORD_MESSAGE_AUTHOR" ADD CONSTRAINT "FK_b9007ae76cc129235140b867a78" FOREIGN KEY ("DMA_DMEID") REFERENCES "TB_DISCORD_MESSAGE"("DME_ID") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}