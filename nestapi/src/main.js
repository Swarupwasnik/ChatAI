const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./app.module');
const config = require('./config/configuration');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000', // Update with your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  await app.listen(config.port);
  console.log(`Server running on port ${config.port}`);
}
bootstrap();
