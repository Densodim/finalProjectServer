import { Injectable, OnModuleInit } from '@nestjs/common';
import { MeiliSearch } from 'meilisearch';

@Injectable()
export class MeilisearchInitService implements OnModuleInit {
  constructor(private readonly meiliSearch: MeiliSearch) {}

  async onModuleInit(): Promise<void> {
    const index = await this.meiliSearch.getIndex('form');
    await index.updateFilterableAttributes(['isDeleted']);
  }
}
