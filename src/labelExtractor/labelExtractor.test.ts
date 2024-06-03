
import { labelExtractor } from '.';
import {
  Label,
  StandardizedLine,
  StandardizedText,
} from '../types';
import fs from 'fs';

const data = fs.readFileSync('./src/standardized_text.json', { encoding: 'utf-8' });
const text: StandardizedText = JSON.parse(data);

describe('labelExtractor', () => {
  describe('extracts a line below or above', () => {
    const configuration: Label = {
      id: 'label', 
      position: 'below',
      textAlignment: 'left',
      anchor: 'distance'
    };

    test('below - distance', () => {
      const match = labelExtractor(configuration, text) as StandardizedLine;

      expect(match.text)
        .toBe('733mi');
    });

    test('below - load number', () => {
      configuration.anchor = 'load number';
      const match = labelExtractor(configuration, text) as StandardizedLine;

      expect(match.text)
        .toBe('4836118435');
    });
  });
  
  describe('extracts multi-line values below', () => {
    const configuration: Label = {
      id: 'label',
      position: 'below',
      textAlignment: 'left',
      anchor: 'pickup notes'
    };

    test('extract multi-line value below pickup notes', () => {
      const match = labelExtractor(configuration, text) as StandardizedLine[];
      const multiline = match.map(line => line.text).join('');

      expect(multiline)
        .toBe("\"TRACKING - The driver must be EASY to contact or active onthe Uber Freight app at all times during the transit of thisload, in order to provide updates to the tracking team.\"")
    });

    // add one more test 
    test('extract multi-line value below "\detention\"', () => {
      configuration.anchor = 'detention';
      const match = labelExtractor(configuration, text) as StandardizedLine[];
      const multiLine = match.map(line => line.text).join('');

      expect(multiLine)
        .toBe("Submit requests for detention payment in the Uber Freight App or att.uber.com/detention. To qualify for detention, arrive on time to thescheduled appointment and submit your request within 24 hours ofdelivery, along with the signed BOL showing in and out times. If thecarrier’s designated driver is not using the Uber Freight App, they mustcall 844-822-UBER at least 30 minutes prior to entering detention orthe request may be denied. Detention starts 2 hours after thescheduled appointment and maxes out at 5 hours")
    });
  });

  describe('extracts left or right', () => {
    test('anchor line right', () => {
      const configuration: Label = {
        id: 'label',
        position: 'right',
        anchor: 'please call our 24/7 number:',
        textAlignment: 'left',
      };
      const line = labelExtractor(configuration, text) as StandardizedLine;

      expect(line.text).toBe('844-822-UBER');
    })

    test('anchor line left', () => {
      const configuration: Label = {
        id: 'label',
        position: 'right',
        anchor: 'maxes out at',
        textAlignment: 'left',
      };
      const line = labelExtractor(configuration, text) as StandardizedLine;

      expect(line.text).toBe('5 hours');
    });
  });
});