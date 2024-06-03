import fs from 'fs';
import { rowExtractor } from '.';
import {
  Row,
  StandardizedText,
} from '../types';

const data = fs.readFileSync('./src/standardized_text.json', { encoding: 'utf-8' });
const text: StandardizedText = JSON.parse(data);

describe('rowExtractor', () => {
  describe('matches to the right', () => {
    test('match on first tiebreaker', () => {
      const configuration: Row = {
        id: "row",
        position: "right",
        tiebreaker: "first",
        anchor: "line haul"
      };
      const line = rowExtractor(configuration, text);
      expect(line.text).toBe('$1770.00');

      configuration.anchor = 'total';
      const line2 = rowExtractor(configuration, text);
      expect(line2.text).toBe('$1770.00')
    });
  
    test('match on second tiebreaker', () => {
      const configuration: Row = {
        id: "row",
        position: "right",
        tiebreaker: "second",
        anchor: "mc number"
      };
      const line = rowExtractor(configuration, text);
      expect(line.text).toBe('Booked on');
    });
  });

  describe('matches to the left', () => {
    test('match on first tiebreaker', () => {
      const configuration: Row = {
          id: "row",
          position: "left",
          tiebreaker: "first",
          anchor: "booked on",
      };
      const line = rowExtractor(configuration, text)
      expect(line.text).toBe('DOT number');
    });

    test('match on last tiebreaker', () => {
      const configuration: Row = {
          id: "row",
          position: "left",
          tiebreaker: "last",
          anchor: "booked on",
      };
      const line = rowExtractor(configuration, text);
      expect(line.text).toBe('Booked by');
    });
  });
  

  describe('exceptions', () => {
    test('should throw if anchor line cannot be found', () => {
        const configuration: Row = {
          id: "row",
          position: "right",
          tiebreaker: "first",
          anchor: "bad anchor",
        };
        expect(() => rowExtractor(configuration, text))
          .toThrow("Failed to find anchor line")
    });

    test('should throw if the row has no matches', () => {
        const configuration: Row = {
          id: "row",
          position: "left",
          tiebreaker: "first",
          anchor: "load details",
        };
        expect(() => rowExtractor(configuration, text))
          .toThrow(`Failed to find "${configuration.tiebreaker}" match at "${configuration.position}" position of anchor "${configuration.anchor}"`)
    });
  });
});
