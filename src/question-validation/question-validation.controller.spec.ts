import { Test, TestingModule } from '@nestjs/testing';
import { QuestionValidationController } from './question-validation.controller';
import { QuestionValidationService } from './question-validation.service';

describe('QuestionValidationController', () => {
  let controller: QuestionValidationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionValidationController],
      providers: [QuestionValidationService],
    }).compile();

    controller = module.get<QuestionValidationController>(
      QuestionValidationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
