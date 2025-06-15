import { Test, TestingModule } from '@nestjs/testing';
import { FormSettingsService } from './form-settings.service';

describe('FormSettingsService', () => {
  let service: FormSettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FormSettingsService],
    }).compile();

    service = module.get<FormSettingsService>(FormSettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
