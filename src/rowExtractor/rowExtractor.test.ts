import * as text from '../standardized_text.json';
import { rowExtractor } from '.';
import { Row } from '../types';

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
      expect(line)
        .toEqual({
          "text": "$1770.00",
          "boundingPolygon": [
            { "x": 6.765, "y": 1.994 },
            { "x": 7.315, "y": 1.994 },
            { "x": 7.315, "y": 2.122 },
            { "x": 6.765, "y": 2.122 }
          ] 
        });
       
      configuration.anchor = 'total';
      const line2 = rowExtractor(configuration, text);
      expect(line2)
        .toEqual({
          "text": "$1770.00",
          "boundingPolygon": [
            { "x": 6.632, "y": 2.389 },
            { "x": 7.314, "y": 2.389 },
            { "x": 7.314, "y": 2.544 },
            { "x": 6.632, "y": 2.544 }
          ]
        })
    });
  
    test('match on second tiebreaker', () => {
      const configuration: Row = {
        id: "row",
        position: "right",
        tiebreaker: "second",
        anchor: "mc number"
      };
      const line = rowExtractor(configuration, text);
      expect(line)
        .toEqual({
          "text": "Booked on",
          "boundingPolygon": [
            { "x": 5.618, "y": 1.482 },
            { "x": 6.135, "y": 1.482 },
            { "x": 6.135, "y": 1.586 },
            { "x": 5.618, "y": 1.586 }
          ]
        })
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
