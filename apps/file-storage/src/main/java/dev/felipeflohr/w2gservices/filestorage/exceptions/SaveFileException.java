package dev.felipeflohr.w2gservices.filestorage.exceptions;

public class SaveFileException extends RuntimeException {
    public SaveFileException() {}

    public SaveFileException(Exception e) {
        super(e);
    }
}
