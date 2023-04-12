# Webapi Nodejs

[![MIT license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Codecov](https://img.shields.io/codecov/c/github/leal32b/webapi-nodejs?logo=codecov&logoColor=white)](https://app.codecov.io/gh/leal32b/webapi-nodejs)
[![CircleCI](https://img.shields.io/circleci/build/github/leal32b/webapi-nodejs/main?logo=circleci)](https://app.circleci.com/pipelines/github/leal32b/webapi-nodejs)
[![Code Climate maintainability](https://img.shields.io/codeclimate/maintainability/leal32b/webapi-nodejs?logo=code-climate)](https://codeclimate.com/github/leal32b/webapi-nodejs/maintainability)
[![Code Climate issues](https://img.shields.io/codeclimate/issues/leal32b/webapi-nodejs?logo=codeclimate)](https://codeclimate.com/github/leal32b/webapi-nodejs/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/leal32b/webapi-nodejs?logo=github)](https://github.com/leal32b/webapi-nodejs/pulls)
[![GitHub issues](https://img.shields.io/github/issues/leal32b/webapi-nodejs?logo=github)](https://github.com/leal32b/webapi-nodejs/issues)


This project aims to serve as a template for the creation of new Web APIs. Applying concepts of TDD (Test-Driven Development), DDD (Domain-Driven Design) and Clean Architecture, it comes with pre-built: user and profile management, events handling and the option to use SQL or noSQL databases.


<!--
## Table of Contents

- [Webapi Nodejs](#webapi-nodejs)
  - [Getting Started](#getting-started)
  - [Technologies & Tools](#technologies--tools)
  - [License](#license)
-->


## Getting Started

- Create a copy of `.env.development` and rename it to `.env`
- Run the following commands:
```bash
# Install dependencies:
npm install

# Build project:
npm run build

# Start containers (make sure docker is running on your machine):
npm run docker:up

# Run migrations:
npm run migration:run

# Endpoint will be listening at http://localhost:3000/api
```


## Technologies & Tools

<a rel="Node.js" href="https://nodejs.org"><img src="./docs/logos/nodejs.svg" height="32"/></a>
<a rel="TypeScript" href="https://www.typescriptlang.org"><img src="./docs/logos/typescript.svg" height="32"/></a>
<a rel="Vitest" href="https://vitest.dev"><img src="./docs/logos/vitest.svg" height="32"/></a>
<a rel="ESLint" href="https://eslint.org"><img src="./docs/logos/eslint.svg" height="32"/></a>
<a rel="Standard " href="https://standardjs.com"><img src="./docs/logos/standardjs.svg" height="32"/></a>
<a rel="husky" href="https://typicode.github.io/husky"><img src="./docs/logos/husky.png" height="32"/></a>
<a rel="lint-staged" href="https://github.com/okonet/lint-staged#readme"><img src="./docs/logos/lintstaged.png" height="32"/></a>
<a rel="jscpd" href="https://github.com/kucherenko/jscpd#readme"><img src="./docs/logos/jscpd.svg" height="32"/></a>
<a rel="Conventional Commits" href="https://www.conventionalcommits.org"><img src="./docs/logos/conventionalcommits.svg" height="32"/></a>
<a rel="Express" href="https://expressjs.com"><img src="./docs/logos/express.svg" height="32"/></a>
<a rel="Swagger" href="https://swagger.io"><img src="./docs/logos/swagger.svg" height="32"/></a>
<a rel="Docker" href="https://www.docker.com"><img src="./docs/logos/docker.svg" height="32"/></a>
<a rel="PostgreSQL" href="https://www.postgresql.org"><img src="./docs/logos/postgresql.svg" height="32"/></a>
<a rel="MongoDB" href="https://www.mongodb.com"><img src="./docs/logos/mongodb.svg" height="32"/></a>
<a rel="Rabbitmq" href="https://www.rabbitmq.com"><img src="./docs/logos/rabbitmq.svg" height="32"/></a>
<a rel="CircleCI" href="https://circleci.com"><img src="./docs/logos/circleci.svg" height="32"/></a>
<a rel="Codecov" href="https://about.codecov.io"><img src="./docs/logos/codecov.svg" height="32"/></a>
<a rel="Code Climate" href="https://codeclimate.com"><img src="./docs/logos/codeclimate.svg" height="32"/></a>
<a rel="Render" href="https://render.com"><img src="./docs/logos/render.svg" height="32"/></a>
<a rel="VS Code" href="https://code.visualstudio.com"><img src="./docs/logos/vscode.svg" height="32"/></a>
<a rel="DBeaver" href="https://dbeaver.io"><img src="./docs/logos/dbeaver.svg" height="32"/></a>
<a rel="Insomnia" href="https://insomnia.rest"><img src="./docs/logos/insomnia.svg" height="32"/></a>


## License

Licensed under the [MIT](LICENSE) license.
