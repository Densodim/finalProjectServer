import { Controller } from '@nestjs/common';
import { DropboxService } from './dropbox.service';

@Controller('dropbox')
export class DropboxController {
  constructor(private readonly dropboxService: DropboxService) {}
}
