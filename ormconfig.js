const src = process.env.SRC || 'dist'

module.exports = {
  type: 'postgres',
  host: process.env.DB_POSTGRES_HOST,
  port: process.env.DB_POSTGRES_PORT,
  username: process.env.DB_POSTGRES_USERNAME,
  password: process.env.DB_POSTGRES_PASSWORD,
  database: process.env.DB_POSTGRES_DATABASE,
  synchronize: process.env.DB_POSTGRES_SYNCHRONIZE === 'true',
  entities: [`${src}/3.infra/databases/postgres/entities/*.{js,ts}`],
  migrations: [`${src}/3.infra/databases/postgres/migration/**/*.{js,ts}`],
  cli: {
    entitiesDir: `${src}/3.infra/databases/postgres/entities`,
    migrationsDir: `${src}/3.infra/databases/postgres/migration`
  }
}
