import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { ItemsModule } from './items/items.module';

@Module({
  imports: [ConfigModule, DatabaseModule, ItemsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
