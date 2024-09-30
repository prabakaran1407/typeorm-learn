import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { Item } from './src/items/entities/item.entity';
import { Listing } from './src/items/entities/listing.entity';
import { Tag } from './src/items/entities/tag.entity';
import { DataSource } from 'typeorm';
import { Comment } from './src/items/entities/comment.entity';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'mysql',
  host: configService.getOrThrow<string>('MYSQL_HOST'),
  port: configService.getOrThrow<number>('MYSQL_PORT'),
  username: configService.getOrThrow<string>('MYSQL_USERNAME'),
  password: configService.getOrThrow<string>('MYSQL_PASSWORD'),
  database: configService.getOrThrow<string>('MYSQL_DATABASE'),

  migrations: ['migrations/**'],
  entities: [Item, Listing, Comment, Tag],
});
