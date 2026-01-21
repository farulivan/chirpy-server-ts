import type { MigrationConfig } from 'drizzle-orm/migrator';

type DBConfig = {
  url: string;
  migrationConfig: MigrationConfig;
};

type APIConfig = {
  port: number;
  fileserverHits: number;
  jwtSecret: string;
};

process.loadEnvFile();

function envOrThrow(key: string) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}

const migrationConfig: MigrationConfig = {
  migrationsFolder: './src/db/migrations',
};

export const config: { api: APIConfig; db: DBConfig } = {
  api: {
    port: 8080,
    fileserverHits: 0,
    jwtSecret: envOrThrow('SECRET'),
  },
  db: {
    url: envOrThrow('DB_URL'),
    migrationConfig,
  },
};
