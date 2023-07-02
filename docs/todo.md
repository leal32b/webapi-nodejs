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
[ ] adjust all tests of classes that has more than one method, add a `desc` for each one
[x] remove "user" from "sign-up-user-use-case" and "sign-in-user-use-case"
[x] interface Encrypter, adjust "data: TokenData" to "tokenData: TokenData"
[x] adjust controllers success tests from "... valid params are provided" to "... handle succeeds"
[x] verify SutTypes members order (must be equal to props, doubles, etc)
[x] adjust text message of UseCaseStubs in controller tests, it must be "any_message"
[x] break lines on schema definitions (required)
[x] change "this.validateParams" to "this.validateProps"?
[ ] verify applyOnRight, remove last "return"
[ ] add createdAt, updatedAt and active to entities/aggregates
[ ] give a better name to Props and (Entity/Aggregate)Props (should (Entity/Aggregate)Props be named Props?)
[x] fix paramsFake -> propsFake
[x] create userMapper (toDomain, toPersistence)
[ ] change "create, read, update, delete" to "save, find, delete"
[x] create default methods inside repositories
[x] rename value-objects with entity radical
[ ] implement error return in UserAggregate
[x] create mechanism to update updatedAt of entities
[ ] write tests for UserEntity updatedAt updates
