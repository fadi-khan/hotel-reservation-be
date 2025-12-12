import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger/swagger.config';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log("Server is running on port ",process.env.PORT)

  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:3001', // put your frontend URL/port here
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  });
  setupSwagger(app);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
