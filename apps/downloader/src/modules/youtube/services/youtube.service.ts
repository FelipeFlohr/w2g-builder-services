import { Inject, Injectable } from "@nestjs/common";
import { SocialMediaEnum } from "src/enums/social-media.enum";
import { EnvironmentService } from "src/env/services/environment.service";
import { IVideoDownloader } from "src/modules/downloader/interfaces/video-downloader.interface";
import { VideoFileDTO } from "src/modules/downloader/models/video-file.dto";
import { LoggerUtils } from "src/utils/logger-utils";
import { UniqueUtils } from "src/utils/unique-utils";
import { YoutubeDownloaderConstants } from "../constants/youtube-downloader.constants";
import { ProcessUtils } from "src/utils/process-utils";
import { FailedToDownloadError } from "src/modules/downloader/errors/failed-to-downloader.error";
import { StreamUtils } from "src/utils/stream-utils";
import * as path from "path";
import * as os from "os";

@Injectable()
export class YoutubeService implements IVideoDownloader {
  public readonly platform: SocialMediaEnum = SocialMediaEnum.YOUTUBE;
  private readonly logger = LoggerUtils.from(YoutubeService);
  private readonly env: EnvironmentService;
  private readonly youtubePrefixes = [
    "https://youtu.be",
    "https://www.youtu.be",
    "https://youtube.com",
    "https://www.youtube.com",
  ] as const;

  public constructor(@Inject(EnvironmentService) env: EnvironmentService) {
    this.env = env;
  }

  public isDownloadableVideo(url: string): boolean {
    return this.youtubePrefixes.some((u) => url.trim().toLowerCase().startsWith(u.trim().toLowerCase()));
  }

  public async download(url: string): Promise<VideoFileDTO> {
    const filePath = path.join(
      os.tmpdir(),
      `/${UniqueUtils.getUuidV4()}${YoutubeDownloaderConstants.YOUTUBE_DL_FORMAT}`,
    );

    const command = [
      this.env.youtubeCommand,
      url,
      YoutubeDownloaderConstants.YOUTUBE_DL_OUTPUT_OPTION,
      filePath,
      YoutubeDownloaderConstants.YOUTUBE_DL_FORMAT_OPTION,
      YoutubeDownloaderConstants.YOUTUBE_DL_BEST_FORMAT_ARG,
    ] as const;

    const process = await ProcessUtils.runProcess(command.join(" "));
    if (process.stdoutResult.trim() != "" && process.exitCode != 0) {
      const msg = `Command ${command.join(" ")} exited with code ${process.exitCode}. Stdout: ${process.stdoutResult}`;
      this.logger.error(msg);
      throw new FailedToDownloadError(url);
    }

    return new VideoFileDTO({
      filename: path.parse(filePath).base,
      stream: StreamUtils.createDeletableReadStream(filePath),
      mimeType: `video/${YoutubeDownloaderConstants.YOUTUBE_DL_FORMAT.replace(".", "")}`,
      url: url,
      filePath: filePath,
    });
  }
}
