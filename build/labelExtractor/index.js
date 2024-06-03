"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.labelExtractor = void 0;
const types_1 = require("../types");
const rowExtractor_1 = require("../rowExtractor");
const labelExtractor = (configuration, text) => {
    const { pages } = text;
    const { anchor, position } = configuration;
    /**
     * Find location of anchor string within text
     */
    const [page, line] = (0, rowExtractor_1.findAnchorPosition)(pages, anchor);
    if (page === undefined || line === undefined) {
        throw new Error("Failed to find anchor line");
    }
    const lines = pages[page].lines;
    const matches = findMatches(configuration, line, lines);
    if (matches.length === 0) {
        throw new Error(`Failed to find match at "${position}" position of anchor "${anchor}"`);
    }
    if (matches.length > 1) {
        return matches;
    }
    ;
    return matches[0];
};
exports.labelExtractor = labelExtractor;
/**
 * Scans lines array starting from anchor position and looks for matches adjacent to the anchor line
 */
const findMatches = (configuration, anchorLineIndex, lines) => {
    const { position, textAlignment, anchor } = configuration;
    const anchorBounds = lines[anchorLineIndex].boundingPolygon;
    const matches = [];
    if (position === 'below' || position === 'above') {
        const horizontalBoundary = textAlignment === 'right' ? types_1.TOP_RIGHT : types_1.TOP_LEFT;
        if (position === 'below') {
            // Iterate to the right over lines[] looking for matches on horizontal boundary. 
            // Break when the vertical gap is greater than 0.1.
            let currentLineIndex = anchorLineIndex + 1;
            let bottomBoundary = anchorBounds[types_1.BOTTOM_LEFT].y;
            while (currentLineIndex < lines.length) {
                const currentLine = lines[currentLineIndex];
                const currentLineBounds = currentLine.boundingPolygon;
                if (currentLineBounds[horizontalBoundary].x === anchorBounds[horizontalBoundary].x) {
                    let verticalGap = Math.abs(bottomBoundary - currentLineBounds[types_1.TOP_LEFT].y);
                    if (verticalGap > 0.1) {
                        break;
                    }
                    matches.push(currentLine);
                    // Update bottomBoundary
                    bottomBoundary = currentLine.boundingPolygon[types_1.BOTTOM_LEFT].y;
                }
                currentLineIndex += 1;
            }
        }
        if (position === 'above') {
            // Iterate to the left over lines[] looking for matches on horizontal boundary.
            // Does not find multi-line values.
            let currentLineIndex = anchorLineIndex - 1;
            while (currentLineIndex >= 0) {
                const currentLine = lines[currentLineIndex];
                const currentLineBounds = currentLine.boundingPolygon;
                if (currentLineBounds[horizontalBoundary].x === anchorBounds[horizontalBoundary].x) {
                    let verticalGap = Math.abs(anchorBounds[types_1.TOP_LEFT].y - currentLineBounds[types_1.BOTTOM_LEFT].y);
                    if (verticalGap > 0.1) {
                        break;
                    }
                    matches.push(currentLine);
                    break;
                }
                currentLineIndex -= 1;
            }
        }
    }
    // For matching text to the left or right, returns the rest of the anchor line..
    // This is not great, but I added some tests to show it basically works.
    if (position === 'left' || position === 'right') {
        const regex = new RegExp(`${anchor}`, 'i');
        const anchorLine = lines[anchorLineIndex];
        const textArray = anchorLine.text.split(regex);
        const text = position === 'left' ? textArray[0] : textArray[1];
        const filteredLine = {
            text: text.trim(),
            boundingPolygon: anchorLine.boundingPolygon
        };
        matches.push(filteredLine);
    }
    return matches;
};
