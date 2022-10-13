# Webapi Nodejs

[![MIT license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Codecov](https://img.shields.io/codecov/c/github/leal32b/webapi-nodejs?logo=codecov&logoColor=white)](https://app.codecov.io/gh/leal32b/webapi-nodejs)
[![CircleCI](https://img.shields.io/circleci/build/github/leal32b/webapi-nodejs/main?logo=circleci)](https://app.circleci.com/pipelines/github/leal32b/webapi-nodejs)
[![Code Climate maintainability](https://img.shields.io/codeclimate/maintainability/leal32b/webapi-nodejs?logo=code-climate)](https://codeclimate.com/github/leal32b/webapi-nodejs/maintainability)
[![Code Climate issues](https://img.shields.io/codeclimate/issues/leal32b/webapi-nodejs?logo=codeclimate)](https://codeclimate.com/github/leal32b/webapi-nodejs/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/leal32b/webapi-nodejs?logo=github)](https://github.com/leal32b/webapi-nodejs/pulls)
[![GitHub issues](https://img.shields.io/github/issues/leal32b/webapi-nodejs?logo=github)](https://github.com/leal32b/webapi-nodejs/issues)


This project aims to serve as a template for the creation of new Web APIs.\
Comming with user and profile management, communication events and the option to use SQL or noSQL databases, its design and implementation apply concepts of Test-Driven Development, Domain-Driven Design and Clean Architecture.

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

[![Node.js](https://img.shields.io/static/v1?&label&message=Node.js&color=black&logo=node.js)](https://nodejs.org)
[![TypeScript](https://img.shields.io/static/v1?&label&message=TypeScript&color=black&logo=typescript)](https://www.typescriptlang.org)
[![Jest](https://img.shields.io/static/v1?&label&message=Jest&color=black&logo=jest)](https://jestjs.io)
[![ESLint](https://img.shields.io/static/v1?&label&message=ESLint&color=black&logo=eslint)](https://eslint.org)
[![Standard JS](https://img.shields.io/static/v1?&label&message=Standard%20JS&color=black&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABLUExURUxpcfPgR/PgR+bURfThR/PgR/PgR/XiR/PgR/ThR/PgR/PgR/PgR/HfR/ThR+PQRJGHN+zZRsO0P6GVOX93NayfPMu7QdbFQnFqMxQPmaUAAAAOdFJOUwAjbtNHA+kX1cGKBI8DvvajnAAAAIdJREFUGNNljwEPhCAIha00te4ERK3//0sD61q33hiDb0PfM0a12hitM7eGz5zSvAzX6seQusLoZXU2plvRfo0PiXQmkAaTF9A459xqlY4KJkQuiAULcwcBTm1ABEGBvpCZS9OPfqDKCTwAVWwFH4D3ivsFujHYSEqNubf1Hm75C3cGinbt4wF3+QpVhYZHvgAAAFd6VFh0UmF3IHByb2ZpbGUgdHlwZSBpcHRjAAB4nOPyDAhxVigoyk/LzEnlUgADIwsuYwsTIxNLkxQDEyBEgDTDZAMjs1Qgy9jUyMTMxBzEB8uASKBKLgDqFxF08kI1lQAAAABJRU5ErkJggg==)](https://standardjs.com)
[![husky](https://img.shields.io/static/v1?&label&message=husky&color=black&logo=data:image/png;base64,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)](https://typicode.github.io/husky)
[![lint-staged](https://img.shields.io/static/v1?&label&message=lint-staged&color=black&logo=data:image/png;base64,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)](https://github.com/okonet/lint-staged#readme)
[![Conventional Commits](https://img.shields.io/static/v1?&label&message=Conventional%20Commits&color=black&logo=conventionalcommits)](https://www.conventionalcommits.org)
[![Docker](https://img.shields.io/static/v1?&label&message=Docker&color=black&logo=docker)](https://www.docker.com)
[![MongoDB](https://img.shields.io/static/v1?&label&message=MongoDB&color=black&logo=mongodb)](https://www.mongodb.com)
[![PostgreSQL](https://img.shields.io/static/v1?&label&message=PostgreSQL&color=black&logo=postgresql)](https://www.postgresql.org)
[![CircleCI](https://img.shields.io/static/v1?&label&message=CircleCI&color=black&logo=circleci)](https://circleci.com)
[![Codecov](https://img.shields.io/static/v1?&label&message=Codecov&color=black&logo=codecov)](https://about.codecov.io)
[![Code Climate](https://img.shields.io/static/v1?&label&message=Code%20Climate&color=black&logo=codeclimate)](https://codeclimate.com)
[![Render](https://img.shields.io/static/v1?&label&message=Render&color=black&logo=render)](https://render.com)
[![MongoDB Cloud](https://img.shields.io/static/v1?&label&message=MongoDB%20Cloud&color=black&logo=mongodb)](https://mongodb.com)
[![VS Code](https://img.shields.io/static/v1?&label&message=VS%20Code&color=black&logo=visualstudiocode&logoColor=007ACC)](https://code.visualstudio.com)
[![DBeaver](https://img.shields.io/static/v1?&label&message=DBeaver&color=black&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABsFBMVEUAAAD////////////////////////////////////+/v7t7OvBvbv7+/v////////+/v7y8fD////////////////////////Z19bSz87y8fH////8+/vu7e308/PMyMb4+Pj29vXMycjJxcPk4uHp5+eXkI04KSU/MCy0rqzZ1tWuqKfEvruMe3GAcWlnWlXl4uFfU08zIx4yIh16cGy/u7mtpqOrmo+IcGGBalt3YlXVzsrv7u5YTEgzJB9mWlfRzs24raeFb2FpVUp8Z1pyYVfPy8n39/ZpXlpXS0ajkoeCbF5AMCllWVSknZvx8O+QiIU1JSBIOzailpCNd2hnU0g2JyI5KyZ0amb39/fIxMI+LypUR0Ojk4qIcWJWRDs0JSBIOjbe29tqX1wwIBtmWlagjoNaRz41JiE7LCfHw8G7trQ5KiVkWFOMe3J3YVRvW084KCPAvLr29vZ4bmtLPTh6a2RGNS5kUUY9LSc1JSE/MCvOy8rd29pcUExXSUM6KyY3KCJMPzrk4uLV0tFtY18+MCs3KCNCNC9FNzNOQT3y8fDMyMe8t7XSz87c2di9+1+CAAAAG3RSTlMAAAZIp+P6GJHu7rD+/rAFkeztpuL87P7+7pHv+4k9AAAAAWJLR0QB/wIt3gAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+YKDBARCE2L/XQAAAD7SURBVBjTY2BgYGRiZmFlY2NlYWZiZAByGdk5OKWlpWVk5bg42BkZGRjZuXnkFaQVlZRVVHn52BkZ+AXU1DU0tbR1dPX0DaQ5+BmYBQ2NjE1MzcwtLK2spYWYGYRtbO2M7B0cnZxdXN2kpYUZRNw9jOw8zby8fXz9/KWlRRjYpAOMAoOCQ0LDwiMipaVFgQJR0XYxsXHxCQmJSSABEWm55JTUNIv0hIzMLJAWYWnp7JzcvPyCwoycIpChzGLSxSWlZeUVlVXVNSBr+TmkpWvr6hsaM+yamkEOY2TnE5duaW1r7+jskgA5HeK57p7evn5JKZDnoN4XFYV6HwA3UDDodUGUzQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMi0xMC0xMlQxNjoxNzowOCswMDowMGr6zmEAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjItMTAtMTJUMTY6MTc6MDgrMDA6MDAbp3bdAAAAAElFTkSuQmCC)](https://dbeaver.io)
[![Insomnia](https://img.shields.io/static/v1?&label&message=Insomnia&color=black&logo=insomnia)](https://insomnia.rest)


  ## License

Licensed under the [MIT](LICENSE) license.
