// const root = process.env.SRC || 'dist'
const root = process.env.NODE_ENV === 'test' ? 'src' : 'dist'

const defaultOptions = {
  type: 'postgres',
  host: process.env.DB_POSTGRES_HOST,
  port: process.env.DB_POSTGRES_PORT,
  username: process.env.DB_POSTGRES_USERNAME,
  password: process.env.DB_POSTGRES_PASSWORD,
  database: process.env.DB_POSTGRES_DATABASE,
  synchronize: process.env.DB_POSTGRES_SYNCHRONIZE === 'true',
  entities: [`${root}/3.infra/databases/postgres/entities/*.{js,ts}`],
  migrations: [`${root}/3.infra/databases/postgres/migration/**/*.{js,ts}`],
  cli: {
    entitiesDir: `${root}/3.infra/databases/postgres/entities`,
    migrationsDir: `${root}/3.infra/databases/postgres/migration`
  }
}

module.exports = [
  defaultOptions,
  {
    ...defaultOptions,
    name: 'test',
    database: `${defaultOptions.database}_test`,
    synchronize: true
  }
]
