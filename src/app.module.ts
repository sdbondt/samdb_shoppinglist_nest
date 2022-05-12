import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { config } from 'dotenv';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { AuthModule } from './auth/auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UserInterceptor } from './user/interceptors/user.interceptor';
import { Item } from './items/item.entity';
import { ItemsModule } from './items/items.module';
config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PG_HOST,
      port: parseInt(process.env.PORT as string),
      username: process.env.PG_USERNAME,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
      entities: [User, Item],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    ItemsModule,
  ],
  controllers: [AppController, UserController],
  providers: [AppService,
    UserService,
    {
      provide: APP_INTERCEPTOR,
      useClass: UserInterceptor,
    }
  ],
})
export class AppModule {}
