import { Test, TestingModule } from '@nestjs/testing';
import { FormSettingsController } from './form-settings.controller';
import { FormSettingsService } from './form-settings.service';

describe('FormSettingsController', () => {
  let controller: FormSettingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormSettingsController],
      providers: [FormSettingsService],
    }).compile();

    controller = module.get<FormSettingsController>(FormSettingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
