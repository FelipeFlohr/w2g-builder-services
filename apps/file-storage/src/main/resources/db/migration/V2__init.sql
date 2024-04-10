CREATE SEQUENCE IF NOT EXISTS file_reference_pk START WITH 1 INCREMENT BY 50;

CREATE TABLE tb_file_reference
(
    fre_id        BIGINT            NOT NULL,
    created_at    TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_DATE NOT NULL,
    updated_at    TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_DATE NOT NULL,
    version       INTEGER DEFAULT 0 NOT NULL,
    fre_hash      VARCHAR(36)       NOT NULL,
    fre_file_name VARCHAR(1024)     NOT NULL,
    fre_mime_type VARCHAR(256)      NOT NULL,
    fre_file_size BIGINT            NOT NULL,
    CONSTRAINT pk_tb_file_reference PRIMARY KEY (fre_id)
);

ALTER TABLE tb_file_reference
    ADD CONSTRAINT uc_tb_file_reference_fre_hash UNIQUE (fre_hash);
