const {expect} = require('chai');
const rewire = require('rewire');

const builder = rewire('../../../src/actions/high-order-handlers/repair-handler-builder');
const {storeAction} = require('../../../src/state/actions');
const strings = require('../../../src/strings').intents.noInput;

const mockApp = require('../../_utils/mocking/platforms/assistant');
const mockDialog = require('../../_utils/mocking/dialog');

describe('actions', () => {
  let dialog;
  let app;
  let handler;
  const speech = 'Which direction do you go?';
  const reprompt = 'Where are you go?';
  const suggestions = ['west', 'east', 'north', 'south'];

  beforeEach(() => {
    dialog = mockDialog();
    builder.__set__('dialog', dialog);
    handler = builder.buildRapairHandler('no-input', strings);
    app = mockApp();
    app.data.dialog = {
      lastPhrase: {
        speech, reprompt, suggestions,
      },
    };
  });

  describe('high-order handlers', () => {
    describe('repair handler', () => {
      it('should 1st time give suggestion', () => {
        storeAction(app, 'no-input');
        handler(app);
        expect(dialog.ask).to.be.calledWith(
          app,
          {
            speech: strings[0].speech,
            reprompt,
            suggestions,
          }
        );
      });

      it('should 2nd time reprompt', () => {
        storeAction(app, 'no-input');
        storeAction(app, 'no-input');
        handler(app);
        expect(dialog.ask).to.be.calledWith(
          app,
          {
            speech: strings[1].speech.replace('{{reprompt}}', reprompt),
            reprompt,
            suggestions,
          }
        );
      });

      it('should 3rd time fallback', () => {
        storeAction(app, 'no-input');
        storeAction(app, 'no-input');
        storeAction(app, 'no-input');
        handler(app);
        expect(dialog.tell).to.be.calledWith(
          app,
          strings[2]
        );
      });
    });
  });
});
