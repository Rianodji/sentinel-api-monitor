import { Endpoint } from '../../../domain/entities/endpoint.entity';
import { EndpointOrmEntity } from './endpoint.orm-entity';

export class EndpointMapper {
  public static toOrm(endpoint: Endpoint): EndpointOrmEntity {
    const orm = new EndpointOrmEntity();
    orm.id = endpoint.id;
    orm.name = endpoint.name;
    orm.url = endpoint.url;
    orm.interval = endpoint.interval;
    orm.userId = endpoint.userId;
    orm.status = endpoint.status;
    orm.lastCheck = endpoint.lastCheck as Date;
    return orm;
  }

  public static toDomain(orm: EndpointOrmEntity): Endpoint {
    return Endpoint.create(
      {
        name: orm.name,
        url: orm.url,
        interval: orm.interval,
        userId: orm.userId,
      },
      orm.id,
    );
  }
}
