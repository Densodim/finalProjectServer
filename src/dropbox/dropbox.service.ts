import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Dropbox } from "dropbox";

@Injectable()
export class DropboxService {
  private dbx: Dropbox;

  constructor(private readonly configService: ConfigService) {
    this.dbx = new Dropbox({
      accessToken: configService.get<string>("DROPBOX_ACCESS_TOKEN") || "",
    });
  }

  async uploadJson(filename: string, data: any) {
    const content = Buffer.from(JSON.stringify(data, null, 2));
    return this.dbx.filesUpload({
      path: `/${filename}`,
      contents: content,
      mode: { ".tag": "overwrite" },
      autorename: false,
      mute: false,
      strict_conflict: false,
    });
  }
}
