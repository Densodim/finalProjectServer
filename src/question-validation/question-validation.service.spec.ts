import { Test, TestingModule } from '@nestjs/testing';
import { QuestionValidationService } from './question-validation.service';

describe('QuestionValidationService', () => {
  let service: QuestionValidationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuestionValidationService],
    }).compile();

    service = module.get<QuestionValidationService>(QuestionValidationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
