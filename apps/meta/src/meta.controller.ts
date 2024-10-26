import { Controller, Get } from '@nestjs/common';
import { MetaService } from './meta.service';

@Controller()
export class MetaController {
  constructor(private readonly metaService: MetaService) {}

  @Get()
  getHello(): string {
    return this.metaService.getHello();
  }
}
