const test = require('node:test');
const assert = require('node:assert/strict');
const { validateAmount, validatePhone } = require('../controllers/mpesaController');

test('validatePhone normalizes supported Kenyan phone formats', () => {
  assert.equal(validatePhone('254712345678'), '254712345678');
  assert.equal(validatePhone('0712345678'), '254712345678');
  assert.equal(validatePhone('712 345 678'), '254712345678');
});

test('validatePhone rejects invalid values', () => {
  assert.equal(validatePhone('254612345678'), null);
  assert.equal(validatePhone('not-a-phone'), null);
  assert.equal(validatePhone(), null);
});

test('validateAmount accepts whole positive shilling values only', () => {
  assert.equal(validateAmount(1), 1);
  assert.equal(validateAmount('1500'), 1500);
  assert.equal(validateAmount(0), null);
  assert.equal(validateAmount('1.5'), null);
  assert.equal(validateAmount('invalid'), null);
});
