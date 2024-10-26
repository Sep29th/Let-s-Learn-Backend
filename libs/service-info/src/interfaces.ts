import { ClientProvider, MicroserviceOptions } from '@nestjs/microservices';

export interface IConfigService {
  sync?: MicroserviceOptions & ClientProvider;
  async?: MicroserviceOptions & ClientProvider;
}
