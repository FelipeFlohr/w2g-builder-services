import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration11705272458625 implements MigrationInterface {
  name = "Migration11705272458625";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "TB_DISCORD_LISTENER" ("CREATED_AT" TIMESTAMP NOT NULL DEFAULT now(), "UPDATED_AT" TIMESTAMP NOT NULL DEFAULT now(), "VERSION" integer NOT NULL DEFAULT '0', "DLI_ID" SERIAL NOT NULL, "DLI_GUIID" character varying(256) NOT NULL, "DLI_CHAID" character varying(256) NOT NULL, CONSTRAINT "PK_a5a6d35dea33648820897814432" PRIMARY KEY ("DLI_ID"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_212bd5254243469d95222a190c" ON "TB_DISCORD_LISTENER" ("DLI_GUIID", "DLI_CHAID") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_212bd5254243469d95222a190c"`);
    await queryRunner.query(`DROP TABLE "TB_DISCORD_LISTENER"`);
  }
}
