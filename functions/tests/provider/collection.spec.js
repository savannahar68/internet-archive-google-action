const MockAdapter = require('axios-mock-adapter');
const {expect} = require('chai');
const rewire = require('rewire');

const collection = rewire('../../src/provider/collection');

const seventyEight = require('./fixtures/georgeblood.json');
const ofARevolution = require('./fixtures/of-a-revolution-items.json');

describe('collection', () => {
  describe('fetchCollection', () => {
    beforeEach(() => {
      const mock = new MockAdapter(collection.__get__('axios'));
      mock.onGet().reply(200, seventyEight);
    });

    it('should fetch information about collection', () => {
      return collection.fetchDetails('78rpm')
        .then(details => {
          expect(details).to.have.property(
            'title',
            '78rpm Records Digitized by George Blood, L.P.'
          );
        });
    });
  });

  describe('fetchItems', () => {
    beforeEach(() => {
      const mock = new MockAdapter(collection.__get__('axios'));
      mock.onGet().reply(200, ofARevolution);
    });

    it('should fetch items of collection', () => {
      return collection.fetchItems('OfARevolution')
        .then(items => {
          expect(items).to.have.length(50);
          expect(items[0]).to.have.property('identifier', 'oar00-09-27');
          expect(items[0]).to.have.property('coverage', 'Columbus, OH');
          expect(items[0]).to.have.property('subject', 'Live concert');
          expect(items[0]).to.have.property('title', 'Of A Revolution Live at South Oval - Ohio State University on 2000-09-27');
          expect(items[0]).to.have.property('year', '2000');
          expect(items[49]).to.have.property('identifier', 'oar2008-08-14.km184');
          expect(items[49]).to.have.property('coverage', 'Columbus, OH');
          expect(items[49]).to.have.property('title', 'Of A Revolution Live at Lifestyle Communuties Pavilion on 2008-08-14');
          expect(items[49]).to.have.property('year', '2008');
        });
    });
  });
});
