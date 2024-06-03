"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAnchorPosition = exports.rowExtractor = void 0;
const types_1 = require("../types");
const rowExtractor = (configuration, text) => {
    const { pages } = text;
    const { anchor, position, tiebreaker } = configuration, rest = __rest(configuration, ["anchor", "position", "tiebreaker"]);
    /**
     * Find location of anchor string within text
     */
    const [page, line] = (0, exports.findAnchorPosition)(pages, anchor);
    if (page === undefined || line === undefined) {
        throw new Error("Failed to find anchor line");
    }
    const lines = pages[page].lines;
    /**
     * Match lines left or right of anchor line.
     */
    let matches = findMatches(configuration, line, lines);
    if (matches.length === 0 || (tiebreaker === 'second' && matches.length < 2)) {
        throw new Error(`Failed to find "${tiebreaker}" match at "${position}" position of anchor "${anchor}"`);
    }
    if (tiebreaker === 'first') {
        return matches[0];
    }
    if (tiebreaker === 'second') {
        return matches[1];
    }
    return matches[matches.length - 1];
};
exports.rowExtractor = rowExtractor;
/**
 * Returns a tuple containing page and line indices of first occurence of anchor line within text.
 * Works as proof of concept, but a better solution would need to handle multiple occurences of anchor line.
 */
const findAnchorPosition = (pages, anchorLine) => {
    let page;
    let line;
    pages.find(({ lines }, i) => {
        return lines.find(({ text }, j) => {
            if (text.toLowerCase().includes(anchorLine)) {
                page = i;
                line = j;
                return true;
            }
        });
    });
    return [page, line];
};
exports.findAnchorPosition = findAnchorPosition;
/**
 * Scans lines array starting from anchor position and looks either left or right for matches
 */
const findMatches = (configuration, anchorLineIndex, lines) => {
    const { position } = configuration;
    const anchorBounds = lines[anchorLineIndex].boundingPolygon;
    const tolerance = 0.08; // https://docs.sensible.so/docs/row
    const matches = [];
    if (position === 'right') {
        const anchorTopBoundary = anchorBounds[types_1.TOP_RIGHT].y;
        let currentLine = anchorLineIndex + 1;
        while (Math.abs(anchorTopBoundary - lines[currentLine].boundingPolygon[types_1.TOP_RIGHT].y) <= tolerance &&
            currentLine < lines.length) {
            matches.push(lines[currentLine]);
            currentLine += 1;
        }
    }
    else {
        const anchorTopBoundary = anchorBounds[types_1.TOP_RIGHT].y;
        let currentLine = anchorLineIndex - 1;
        while (Math.abs(anchorTopBoundary - lines[currentLine].boundingPolygon[types_1.TOP_RIGHT].y) <= tolerance &&
            currentLine >= 0) {
            matches.push(lines[currentLine]);
            currentLine -= 1;
        }
    }
    return matches;
};
