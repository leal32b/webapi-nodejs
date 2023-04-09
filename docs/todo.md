[ ] adjust errors return
[ ] add return types (HttpResponse) from Controllers
[ ] WebApp verify public prop app
[ ] complete web tests
[ ] move route type from 2.presentation
[x] adjust identifier alphabet
[x] adjust server (app and persistence calls)
[x] adjust typeORM cli https://typeorm.io/changelog#deprecations
[ ] verify token errors
[x] remove legacy-peer-deps=true from .npmrc
[x] verify constructor of validators (can remove it?)
[ ] add validation for errors creation
[ ] verify fail cases for identifier and random tests
[x] move IntegerGreaterThanZero to a common place
[ ] segregate express middlewares and their tests
[x] create tests for aggregate-root
[ ] create enum for http status codes
  src/core/2.presentation/factories/client-error-factory.ts
  src/core/2.presentation/factories/server-error-factory.ts
  src/core/2.presentation/factories/success-factory.ts
[x] change 'params' to 'props' on makeSut
[ ] create a mechanism to log errors (maybe in DomainError)
[x] adjust types in src/core/0.domain/events/domain-events.ts
[x] make-template-compiler -> make-handlebars
[x] mock handlebars on handlebars-adapter.unit.test.ts
[ ] verify if it's needed all the vi.fn()
[ ] revise setup/webApp -> import values and make sets inside index.ts
[ ] adjust container -> events and logging, make functions?
[x] change name of export in src/modules/communication/1.application/i18n/index.ts
[x] adjust colorFunction of winston
[x] log route errors
[x] change 'dataSource' to persistence on logs
[x] adjust mongodb and postgres repository tests (add messageBrokerStub), publish event on postgres
[x] make logging.logger mock
[ ] await publishToTopic? -> modules/user/3.infra/persistence/mongodb/repositories/mongodb-user-repository.ts
[x] change rabbitmq-adapter to amqplib-adapter
[x] merge api-specification with path in api-specification
[ ] add logger to WebApp implementations
[x] change i18n to internationalization
