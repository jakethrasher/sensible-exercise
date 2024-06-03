"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const _1 = require(".");
const data = fs_1.default.readFileSync('./src/standardized_text.json', { encoding: 'utf-8' });
const text = JSON.parse(data);
describe('rowExtractor', () => {
    describe('matches to the right', () => {
        test('match on first tiebreaker', () => {
            const configuration = {
                id: "row",
                position: "right",
                tiebreaker: "first",
                anchor: "line haul"
            };
            const line = (0, _1.rowExtractor)(configuration, text);
            expect(line.text).toBe('$1770.00');
            configuration.anchor = 'total';
            const line2 = (0, _1.rowExtractor)(configuration, text);
            expect(line2.text).toBe('$1770.00');
        });
        test('match on second tiebreaker', () => {
            const configuration = {
                id: "row",
                position: "right",
                tiebreaker: "second",
                anchor: "mc number"
            };
            const line = (0, _1.rowExtractor)(configuration, text);
            expect(line.text).toBe('Booked on');
        });
    });
    describe('matches to the left', () => {
        test('match on first tiebreaker', () => {
            const configuration = {
                id: "row",
                position: "left",
                tiebreaker: "first",
                anchor: "booked on",
            };
            const line = (0, _1.rowExtractor)(configuration, text);
            expect(line.text).toBe('DOT number');
        });
        test('match on last tiebreaker', () => {
            const configuration = {
                id: "row",
                position: "left",
                tiebreaker: "last",
                anchor: "booked on",
            };
            const line = (0, _1.rowExtractor)(configuration, text);
            expect(line.text).toBe('Booked by');
        });
    });
    describe('exceptions', () => {
        test('should throw if anchor line cannot be found', () => {
            const configuration = {
                id: "row",
                position: "right",
                tiebreaker: "first",
                anchor: "bad anchor",
            };
            expect(() => (0, _1.rowExtractor)(configuration, text))
                .toThrow("Failed to find anchor line");
        });
        test('should throw if the row has no matches', () => {
            const configuration = {
                id: "row",
                position: "left",
                tiebreaker: "first",
                anchor: "load details",
            };
            expect(() => (0, _1.rowExtractor)(configuration, text))
                .toThrow(`Failed to find "${configuration.tiebreaker}" match at "${configuration.position}" position of anchor "${configuration.anchor}"`);
        });
    });
});
