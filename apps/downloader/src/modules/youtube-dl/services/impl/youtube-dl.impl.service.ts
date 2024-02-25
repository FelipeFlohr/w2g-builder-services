import { VideoMetadataConvertable } from "src/modules/downloader/interfaces/video-metadata-convertable.interface";
import { VideoMetadataDTO } from "src/modules/downloader/models/video-metadata.dto";
import { YoutubeDlService } from "../youtube-dl.service";
import { Inject, Injectable } from "@nestjs/common";
import { EnvironmentService } from "src/env/services/environment.service";
import { YoutubeDlConstants } from "../../constants/youtube-dl.constants";
import { ProcessUtils } from "src/utils/process-utils";
import { ProcessResultDTO } from "src/models/process-result.dto";
import { FailedToDownloadError } from "src/modules/downloader/errors/failed-to-downloader.error";
import { JsonSerializationService } from "src/modules/json-serialization/services/json-serialization.service";
import { YoutubeDlOptionsType } from "../../types/youtube-dl-options.type";
import { SocialMediaEnum } from "src/enums/social-media.enum";
import { VideoFileDTO } from "src/modules/downloader/models/video-file.dto";
import { UniqueUtils } from "src/utils/unique-utils";
import { StreamUtils } from "src/utils/stream-utils";
import { LoggerUtils } from "src/utils/logger-utils";
import * as path from "path";
import * as os from "os";

@Injectable()
export class YoutubeDlServiceImpl implements YoutubeDlService {
  private readonly logger = LoggerUtils.from(YoutubeDlServiceImpl);

  public constructor(
    @Inject(JsonSerializationService) private readonly jsonSerializationService: JsonSerializationService,
    @Inject(EnvironmentService) private readonly env: EnvironmentService,
  ) {}

  public async getMetadata<O, R extends VideoMetadataConvertable>(
    url: string,
    metadataReturnTarget: YoutubeDlOptionsType<O, R>,
    platform: SocialMediaEnum,
  ): Promise<VideoMetadataDTO> {
    const command = [this.env.youtubeCommand, YoutubeDlConstants.YOUTUBE_DL_JSON_DUMP_OPTION, url] as const;

    const process = await ProcessUtils.runProcess(command);
    this.validateProcessResult(process, command, url, platform);

    const youtubeVideoMetadataOptions = this.jsonSerializationService.deserialize<O>(
      process.stdoutResult,
      metadataReturnTarget,
    );
    const metadata = new metadataReturnTarget(youtubeVideoMetadataOptions);
    return metadata.toVideoMetadataDTO();
  }

  public async download(url: string, platform: SocialMediaEnum): Promise<VideoFileDTO> {
    const filePath = path.join(os.tmpdir(), `/${UniqueUtils.getUuidV4()}${YoutubeDlConstants.YOUTUBE_DL_FORMAT}`);
    const command = [
      this.env.youtubeCommand,
      YoutubeDlConstants.YOUTUBE_DL_OUTPUT_OPTION,
      filePath,
      YoutubeDlConstants.YOUTUBE_DL_FORMAT_OPTION,
      YoutubeDlConstants.YOUTUBE_DL_BEST_FORMAT_ARG,
      url,
    ] as const;

    const process = await ProcessUtils.runProcess(command);
    this.validateProcessResult(process, command, url, platform);

    return new VideoFileDTO({
      filename: path.parse(filePath).base,
      stream: StreamUtils.createDeletableReadStream(filePath),
      mimeType: `video/${YoutubeDlConstants.YOUTUBE_DL_FORMAT.replace(".", "")}`,
      url: url,
      filePath: filePath,
    });
  }

  private validateProcessResult(
    process: ProcessResultDTO,
    command: string[] | readonly string[],
    url: string,
    platform: SocialMediaEnum,
  ): void {
    const commandStr = command.join(" ");
    if (process.stdoutResult.trim() != "" && process.exitCode != 0) {
      const msg = `Command ${commandStr} for platform ${platform} exited with code ${process.exitCode}. Stdout: ${process.stdoutResult}\nStderr: ${process.stderrResult}`;
      this.logger.error(msg);
      throw new FailedToDownloadError(url);
    }
  }
}
