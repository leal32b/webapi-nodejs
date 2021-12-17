const src = process.env.NODE_DEV ? 'dist' : 'src'

module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [`${src}/3.infra/databases/postgres/entities/*.ts`],
  migrations: [`${src}/3.infra/databases/postgres/migration/**/*.ts`],
  cli: {
    migrationsDir: `${src}/3.infra/databases/postgres/migration`
  }
}
