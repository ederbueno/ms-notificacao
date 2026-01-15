import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_BROKER || 'localhost:29092'],
      },
      consumer: {
        groupId: 'notificacao-consumer',
      },
    },

    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp({ format: 'DD/MM/YYYY HH:mm:ss' }),
            winston.format.colorize(),
            winston.format.printf(({ timestamp, level, message, context }) => {
              return `[${timestamp}] ${level}: [${context || 'Notificacao'}] ${message}`;
            }),
          ),
        }),
        new winston.transports.File({ filename: 'logs/notificacao-error.log', level: 'error' }),
      ],
    }),
  });

  await app.listen();

  const logger = new (require('@nestjs/common').Logger)('Bootstrap');
  logger.log('✉️  Microserviço de Notificação pronto para avisar o cliente!');
}
bootstrap();