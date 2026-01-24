import express from 'express';
import postgres from 'postgres';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { drizzle } from 'drizzle-orm/postgres-js';

import { config } from './config.js';
import { apiRoutes } from './presentation/routes/router.js';
import { errorHandler } from './presentation/middleware/error-handler.js';
import { requestLogger } from './presentation/middleware/request-logger.js';

export async function createApp() {
  const migrationClient = postgres(config.db.url, { max: 1 });
  await migrate(drizzle(migrationClient), config.db.migrationConfig);

  const app = express();

  app.use(requestLogger);
  app.use(express.json());

  app.use(apiRoutes);

  app.use(errorHandler);

  return app;
}

export async function startServer() {
  const app = await createApp();

  app.listen(config.api.port, () => {
    console.log(`Server is running at http://localhost:${config.api.port}`);
  });

  return app;
}
