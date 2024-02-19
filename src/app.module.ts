import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validationSchema } from './common/config/validation.config';
import { DatabaseModule } from './database/database.module';
import { StorageModule } from './storage/storage.module';
import { ProvidersModule } from './providers/providers.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { FeedbackModule } from './feedback/feedback.module';
import { OrdersModule } from './orders/orders.module';
import { BillsModule } from './bills/bills.module';
import { RequestFormModule } from './request-form/request-form.module';
import { AuthModule } from './auth/auth.module';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderProductModule } from './order-product/order-product.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    validationSchema,
    envFilePath: [`.env`, `.env.${process.env.NODE_ENV}`], // load env
  }),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      return {
        type: "postgres",
        port: configService.get<number>("POSTGRES_PORT"),
        host: configService.get<string>("POSTGRES_HOST"),
        username: configService.get<string>("POSTGRES_USER"),
        password: configService.get<string>("POSTGRES_PASSWORD"),
        database: configService.get<string>("POSTGRES_DB"),
        entities: [__dirname + "/**/*.entity{.ts,.js}"],
        synchronize: true,
        logging: true,
        autoLoadEntities: true,
      };
    },
    async dataSourceFactory(options) {
      if (!options) {
        throw new Error('Invalid options passed');
      }
      return addTransactionalDataSource(new DataSource(options));
    },
  }),
    UsersModule,
    StorageModule,
    ProvidersModule,
    CategoriesModule,
    ProductsModule,
    FeedbackModule,
    OrdersModule,
    BillsModule,
    RequestFormModule,
    AuthModule,
    OrderProductModule,
  
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
