CREATE TABLE "TB_DISCORD_MESSAGE_AUTHOR"
(
    "DMA_ID"             BIGINT                      NOT NULL,
    "DMA_AVAPNGURL"      VARCHAR(512),
    "DMA_BANPNGURL"      VARCHAR(512),
    "DMA_BOT"            BOOLEAN                     NOT NULL,
    "DMA_AUT_CREATED_AT" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    "DMA_DIS_NAME"       VARCHAR(128)                NOT NULL,
    "DMA_GNAME"          VARCHAR(128),
    "DMA_AUTID"          VARCHAR(32)                 NOT NULL,
    "DMA_SYS"            BOOLEAN                     NOT NULL,
    "DMA_USERNAME"       VARCHAR(255)                NOT NULL,
    "CREATED_AT"         TIMESTAMP WITHOUT TIME ZONE,
    "UPDATED_AT"         TIMESTAMP WITHOUT TIME ZONE,
    "VERSION"            BIGINT,
    CONSTRAINT PK_TB_DISCORD_MESSAGE_AUTHOR PRIMARY KEY ("DMA_ID")
);

CREATE TABLE "TB_DISCORD_MESSAGE"
(
    "DME_ID"             BIGINT        NOT NULL,
    "DME_DMAID"          BIGINT        NOT NULL,
    "DME_CONTENT"        VARCHAR(8192) NOT NULL,
    "DME_MSG_CREATED_AT" TIMESTAMP WITHOUT TIME ZONE,
    "DME_MSGID"          VARCHAR(32)   NOT NULL,
    "DME_PINNED"         BOOLEAN       NOT NULL,
    "DME_POS"            INTEGER,
    "DME_SYS"            BOOLEAN       NOT NULL,
    "DME_URL"            VARCHAR(1024) NOT NULL,
    "DME_GUIID"          VARCHAR(64)   NOT NULL,
    "DME_CHAID"          VARCHAR(64)   NOT NULL,
    "CREATED_AT"         TIMESTAMP WITHOUT TIME ZONE,
    "UPDATED_AT"         TIMESTAMP WITHOUT TIME ZONE,
    "VERSION"            BIGINT,
    CONSTRAINT PK_TB_DISCORD_MESSAGE PRIMARY KEY ("DME_ID")
);

ALTER TABLE "TB_DISCORD_MESSAGE"
    ADD CONSTRAINT "UC_TB_DISCORD_MESSAGE_DME_DMAID" UNIQUE ("DME_DMAID");

ALTER TABLE "TB_DISCORD_MESSAGE"
    ADD CONSTRAINT "FK_TB_DISCORD_MESSAGE_ON_DME_DMAID" FOREIGN KEY ("DME_DMAID") REFERENCES "TB_DISCORD_MESSAGE_AUTHOR" ("DMA_ID");