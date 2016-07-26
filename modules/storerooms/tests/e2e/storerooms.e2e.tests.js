'use strict';

describe('Storerooms E2E Tests:', function () {
  describe('Test Storerooms page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/storerooms');
      expect(element.all(by.repeater('storeroom in storerooms')).count()).toEqual(0);
    });
  });
});
