import { exec } from "child_process";
import { ProcessResultDTO } from "src/models/process-result.dto";
import { TypeUtils } from "./type-utils";

export class ProcessUtils {
  public static runProcess(command: readonly string[]): Promise<ProcessResultDTO>;
  public static runProcess(command: readonly string[] | string): Promise<ProcessResultDTO>;
  public static runProcess(command: readonly string[] | string): Promise<ProcessResultDTO> {
    const commandStr = Array.isArray(command) ? command.join(" ") : (command as string);
    return new Promise<ProcessResultDTO>((res, rej) => {
      let stdoutResult = "";
      let stderrResult = "";

      const process = exec(commandStr, (err) => {
        if (err) {
          return rej(err);
        }
      });

      process.stdout?.on("data", (message: string) => {
        stdoutResult += message;
      });
      process.stderr?.on("data", (message: string) => {
        stderrResult += message;
      });
      process.on("exit", (code) => {
        const result = new ProcessResultDTO(stdoutResult, stderrResult, TypeUtils.parseNullToUndefined(code));
        return res(result);
      });
    });
  }

  private constructor() {}
}
