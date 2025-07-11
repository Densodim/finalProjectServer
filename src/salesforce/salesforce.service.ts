import { Injectable } from '@nestjs/common';
import { Connection } from 'jsforce';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SalesforceService {
  private conn: Connection;

  constructor(private readonly configService: ConfigService) {
    this.conn = new Connection({
      loginUrl: this.configService.get<string>('SF_LOGIN_URL'),
    });
  }

  private async loginIfNeeded() {
    if (!this.conn.accessToken) {
      const username = this.configService.get<string>('SF_USERNAME');
      const password = this.configService.get<string>('SF_PASSWORD');
      const token = this.configService.get<string>('SF_SECURITY_TOKEN');
      if (!username || !password || !token) {
        throw new Error(
          'Salesforce username, password, or security token not set',
        );
      }
      await this.conn.login(username, password + token);
    }
  }

  async loginAndGetUserInfo() {
    await this.loginIfNeeded();
    return this.conn.identity();
  }

  async getSObjects() {
    await this.loginIfNeeded();
    return this.conn.describeGlobal();
  }

  async getAccounts() {
    await this.loginIfNeeded();
    return this.conn.query('SELECT Id, Name FROM Account LIMIT 5');
  }

  async getContacts() {
    await this.loginIfNeeded();
    return this.conn.query(
      'SELECT Id, FirstName, LastName, Email FROM Contact LIMIT 5',
    );
  }

  async getLeads() {
    await this.loginIfNeeded();
    return this.conn.query(
      'SELECT Id, FirstName, LastName, Company, Status FROM Lead LIMIT 5',
    );
  }
}
