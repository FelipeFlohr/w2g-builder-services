import { exec } from "child_process";
import { ProcessResultDTO } from "src/models/process-result.dto";
import { TypeUtils } from "./type-utils";

export class ProcessUtils {
  public static runProcess(command: string): Promise<ProcessResultDTO> {
    return new Promise<ProcessResultDTO>((res, rej) => {
      let stdoutResult = "";
      let stderrResult = "";

      const process = exec(command, (err, stdout, stderr) => {
        if (err) {
          return rej(err);
        }

        stdoutResult += stdout;
        stderrResult += stderr;
      });

      process.on("exit", (code) => {
        const result = new ProcessResultDTO(stdoutResult, stderrResult, TypeUtils.parseNullToUndefined(code));
        return res(result);
      });
    });
  }

  private constructor() {}
}
