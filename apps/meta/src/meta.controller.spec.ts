import { Test, TestingModule } from '@nestjs/testing';
import { MetaController } from './meta.controller';
import { MetaService } from './meta.service';

describe('MetaController', () => {
  let metaController: MetaController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MetaController],
      providers: [MetaService],
    }).compile();

    metaController = app.get<MetaController>(MetaController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(metaController.getHello()).toBe('Hello World!');
    });
  });
});
