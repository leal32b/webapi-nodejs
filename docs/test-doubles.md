# Test Doubles

https://medium.com/rd-shipit/test-doubles-mocks-stubs-fakes-spies-e-dummies-a5cdafcd0daf

## Types of methods
### **Queries**:
Return a result and do not change the observable state of the system (are free of side effects).
### **Commands (modifiers)**:
Change the state of a system but do not return a value.

## Testing queries
Queries are pretty easy to test because we only need to get the response and compare it with the expected outcome.
When testing queries we could use test doubles to replace expensive dependencies and to define their behaviors for the different scenarios. Usually, we will be using **stubs** or **fakes** for that.

## Testing commands
Commands, instead, are a bit harder for testing. We need to verify that we get the expected outcome by looking for their effect on the system. Nevertheless, sometimes we don’t have the possibility to do that because we can’t use the real dependency and we use a test double.
We will need doubles to define the collaborators' behavior and verify that we produce the desired effect, expecting that we send the proper messages to them. These kinds of doubles are called **spies** or **mocks**.

## Introducing test doubles
We will be using a test example to introduce the different types of test doubles. Imagine that we are building a feature to greet our customers for their birthday, sending them an email, maybe with a promo code or another goodie. Here is the setUp:

```typescript
type SutTypes = {
  sut: GreetCustomerForBirthdayHandler
  fakeCustomerRepository: FakeCustomerRepository
  clockServiceStub: ClockServiceStub
  mailerSpy: MailerSpy
  dummyLogger: LoggerDummy
}

const makeSut = (): SutTypes => {
  const injection = {
    fakeCustomerRepository: makeFakeCustomerRepository(),
    clockServiceStub: makeClockServiceStub(),
    mailerSpy: makeMailerSpy(),
    dummyLogger: makeLoggerDummy()
  }
  const sut = new GreetCustomerForBirthdayHandler(injection)

  return { sut, ...injection }
}
```

### **Dummies**
Dummies are test doubles that have no behavior, all their methods return null or nothing. We use them because we need to comply with some interface and we are not particularly interested in what they do.  
Let’s start with the Logger. We may want a logger in the use case but we are not worried about how it is used, but we need it to instantiate the GreetCustomerForBirthdayHandler. This is the case for a dummy.

### **Stubs**
Stubs are test doubles that should have a predefined behavior that we want to control. Imagine that we need to test a service that gets some information talking to an external API. We have an adapter to talk with this API so we will need to double it instead of calling the real API.  
In one of the possible scenarios, we can simulate that the API returns a correct value. In another, we can simulate that the API is down, so we test that our service can manage that situation gracefully. In every possible scenario, we define a stubbed behavior so we can verify our piece of software.  
The use case in our example needs to get the current date to find the customers celebrating a birthday. Working with dates is always a tricky question, so, instead of access to the real system clock, we abstract it in the form of a ClockService. This way. we simply need to stub a fixed date and store a crafted Customer in the test repository.

### **Fakes**
Sometimes we need a collaborator that has the same behavior as the real dependency but in a cheaper way. For example, instead of having a database-backed repository, we could use memory storage to provide the same functionality without the performance penalty. This kind of double is called a Fake.  
Fakes should pass the same tests that the original collaborator, they are alternative implementations.  
We decided to use a FakeCustomerRepository for this test using a memory collection implementation.

### **Spies**
When we are testing commands we need to verify that they produce the expected outcome. If we need to double the dependency we won’t be able to check that outcome. Alternatively, we will need to verify that we send the right message to the collaborator in the object-oriented programming sense.  
Spies are test doubles that can register how they are used so we can interrogate them after executing the subject under test and make assertions about that.  
The side effect of this use case is to send an email. We need to create a Spy that can verify that we call the send method of the MailerService with the appropriate data.

### **Mocks**
Mocks resolve the same problem as spies: we use them to verify that the correct message is sent to the collaborator. The difference is that a mock expects to be used in a certain way so you could say that it carries the assertion with it.  
The problem with spies and mocks is that they introduce a certain degree of fragility given that they couple the test with the implementation of the code under test.  
Also, tests using mocks are more difficult to understand because they hide the assertion into the expectation. It is preferable to use spies, instead.

