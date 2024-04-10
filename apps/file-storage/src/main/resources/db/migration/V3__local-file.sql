CREATE SEQUENCE IF NOT EXISTS file_reference_pk START WITH 1 INCREMENT BY 50;

CREATE TABLE tb_local_file
(
    lfi_id     BIGINT                                           NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_DATE NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_DATE NOT NULL,
    version    INTEGER                     DEFAULT 0            NOT NULL,
    lfi_path   VARCHAR(2048)                                    NOT NULL,
    lfi_freid  BIGINT                                           NOT NULL,
    CONSTRAINT pk_tb_local_file PRIMARY KEY (lfi_id)
);

ALTER TABLE tb_local_file
    ADD CONSTRAINT uc_tb_local_file_lfi_freid UNIQUE (lfi_freid);

ALTER TABLE tb_local_file
    ADD CONSTRAINT uc_tb_local_file_lfi_path UNIQUE (lfi_path);

ALTER TABLE tb_local_file
    ADD CONSTRAINT FK_TB_LOCAL_FILE_ON_LFI_FREID FOREIGN KEY (lfi_freid) REFERENCES tb_file_reference (fre_id);
