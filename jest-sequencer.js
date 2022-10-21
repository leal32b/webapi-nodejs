const Sequencer = require('@jest/test-sequencer').default

class CustomSequencer extends Sequencer {
  sort (tests) {
    const orderedTests = Array
      .from(tests)
      .sort((testA, testB) => (testA.path > testB.path ? 1 : -1))

    return [
      ...orderedTests.filter(test => test.path.includes('unit')),
      ...orderedTests.filter(test => test.path.includes('integration'))
    ]
  }
}

module.exports = CustomSequencer
