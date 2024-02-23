export class ProcessResultDTO {
  public readonly stdoutResult: string;
  public readonly stderrResult: string;
  public readonly exitCode?: number;

  public constructor(stdoutResult: string, stderrResult: string, exitCode?: number) {
    this.stdoutResult = stdoutResult;
    this.stderrResult = stderrResult;
    this.exitCode = exitCode;
  }
}
