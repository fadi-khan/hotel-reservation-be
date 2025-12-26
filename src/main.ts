import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger/swagger.config';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log("Server is running on port ",process.env.NEST_PORT)

  app.use(cookieParser());

  app.enableCors({
    origin: '*', 
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  });
  setupSwagger(app);

const port = process.env.PORT || process.env.NEST_PORT || 3001;;
  await app.listen(port, "0.0.0.0");
  console.log(`Server running on port ${port}`);
}
bootstrap();
