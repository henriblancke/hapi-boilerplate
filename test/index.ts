const Code = require('@hapi/code');
const Lab = require('@hapi/lab');

const { expect } = Code;
const { experiment, it } = (exports.lab = Lab.script());

experiment('dummyExperiment', () => {
  it('should pass because this is a test', () => {
    expect(true).to.equal(true);
  });
});
