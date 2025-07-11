import { Controller, Get, Res } from '@nestjs/common';
import { SalesforceService } from './salesforce.service';
import { Response } from 'express';

@Controller('salesforce')
export class SalesforceController {
  constructor(private readonly salesforceService: SalesforceService) {}

  @Get('demo')
  async demo(@Res() res: Response) {
    try {
      const user = await this.salesforceService.loginAndGetUserInfo();
      return res.json({ user });
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      return res.status(500).json({ error: message });
    }
  }

  @Get('objects')
  async objects(@Res() res: Response) {
    try {
      const result = await this.salesforceService.getSObjects();
      return res.json(result);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      return res.status(500).json({ error: message });
    }
  }

  @Get('accounts')
  async accounts(@Res() res: Response) {
    try {
      const result = await this.salesforceService.getAccounts();
      return res.json(result);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      return res.status(500).json({ error: message });
    }
  }

  @Get('contacts')
  async contacts(@Res() res: Response) {
    try {
      const result = await this.salesforceService.getContacts();
      return res.json(result);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      return res.status(500).json({ error: message });
    }
  }

  @Get('leads')
  async leads(@Res() res: Response) {
    try {
      const result = await this.salesforceService.getLeads();
      return res.json(result);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      return res.status(500).json({ error: message });
    }
  }
}
