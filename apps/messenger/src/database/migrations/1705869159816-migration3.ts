import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration31705869159816 implements MigrationInterface {
  name = "Migration31705869159816";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "TB_DISCORD_DELIMITATION_MESSAGE" ("CREATED_AT" TIMESTAMP NOT NULL DEFAULT now(), "UPDATED_AT" TIMESTAMP NOT NULL DEFAULT now(), "VERSION" integer NOT NULL DEFAULT '0', "DDM_ID" SERIAL NOT NULL, "DDM_DMEID" integer NOT NULL, CONSTRAINT "REL_1e6d3efbff3b0d6bc612be0fe5" UNIQUE ("DDM_DMEID"), CONSTRAINT "PK_4ec24cac8566d0ff6810ccf028f" PRIMARY KEY ("DDM_ID"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "TB_DISCORD_DELIMITATION_MESSAGE" ADD CONSTRAINT "FK_1e6d3efbff3b0d6bc612be0fe5b" FOREIGN KEY ("DDM_DMEID") REFERENCES "TB_DISCORD_MESSAGE"("DME_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "TB_DISCORD_DELIMITATION_MESSAGE" DROP CONSTRAINT "FK_1e6d3efbff3b0d6bc612be0fe5b"`,
    );
    await queryRunner.query(`DROP TABLE "TB_DISCORD_DELIMITATION_MESSAGE"`);
  }
}
