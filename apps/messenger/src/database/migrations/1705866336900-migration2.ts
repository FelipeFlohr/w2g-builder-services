import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration21705866336900 implements MigrationInterface {
  name = "Migration21705866336900";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "TB_DISCORD_MESSAGE_AUTHOR" ("CREATED_AT" TIMESTAMP NOT NULL DEFAULT now(), "UPDATED_AT" TIMESTAMP NOT NULL DEFAULT now(), "VERSION" integer NOT NULL DEFAULT '0', "DMA_ID" SERIAL NOT NULL, "DMA_AVAPNGURL" character varying(2048), "DMA_BANPNGURL" character varying(2048), "DMA_ISBOT" boolean NOT NULL, "DMA_DISCRIM" character varying(2048) NOT NULL, "DMA_DISPNAM" character varying(128) NOT NULL, "DMA_GLOBNAM" character varying(128), "DMA_AUTID" character varying(4000) NOT NULL, "DMA_TAG" character varying(1024) NOT NULL, "DMA_ISSYS" boolean NOT NULL, "DMA_USRNAM" character varying(256) NOT NULL, CONSTRAINT "PK_96cc48e78c11d423bfa2afe23ee" PRIMARY KEY ("DMA_ID"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "TB_DISCORD_MESSAGE" ("CREATED_AT" TIMESTAMP NOT NULL DEFAULT now(), "UPDATED_AT" TIMESTAMP NOT NULL DEFAULT now(), "VERSION" integer NOT NULL DEFAULT '0', "DME_ID" SERIAL NOT NULL, "DME_APPID" character varying(2048), "DME_CLECON" character varying(8192) NOT NULL, "DME_CONTENT" character varying(8192) NOT NULL, "DME_HASTHREAD" boolean NOT NULL, "DME_MESSID" character varying(2048) NOT NULL, "DME_ISPINNABLE" boolean NOT NULL, "DME_ISPINNED" boolean NOT NULL, "DME_POS" integer, "DME_SYSTEM" boolean NOT NULL, "DME_URL" character varying(2048) NOT NULL, "DME_GUIID" character varying(2048) NOT NULL, "DME_CHAID" character varying(2048) NOT NULL, "DME_DMAID" integer, CONSTRAINT "REL_9f6e8167d55d903b8dfd18e961" UNIQUE ("DME_DMAID"), CONSTRAINT "PK_3fd78ccf802a47d4a28893b5eed" PRIMARY KEY ("DME_ID"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_50c5a4ec54013502a68724372e" ON "TB_DISCORD_MESSAGE" ("DME_MESSID") `,
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
      `DROP INDEX "public"."IDX_50c5a4ec54013502a68724372e"`,
    );
    await queryRunner.query(`DROP TABLE "TB_DISCORD_MESSAGE"`);
    await queryRunner.query(`DROP TABLE "TB_DISCORD_MESSAGE_AUTHOR"`);
  }
}
