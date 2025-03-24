import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.localhost,
      port: +process.env.5432,
      username: process.env.postgres,
      password: process.env.admin123,
      database: process.env.postgres,
      autoLoadEntities: true,
      synchronize: true, // Use migrations in production
    }),
    AuthModule,
  ],
})
export class AppModule {}