import {
  Row,
  RowExtractor,
  StandardizedLine,
  StandardizedText,
  StandardizedPage,
  TOP_RIGHT
} from '../types';

export const rowExtractor: RowExtractor = (configuration: Row, text: StandardizedText) => {
  const { pages } = text;
  const { 
    anchor, 
    position, 
    tiebreaker, 
    ...rest 
  } = configuration;

  /**
   * Find location of anchor string within text
   */
  const [ page, line ] = findAnchorPosition(pages, anchor);

  if (page === undefined || line === undefined) {
    throw new Error("Failed to find anchor line")
  }

  const lines = pages[page].lines;

  /**
   * Match lines left or right of anchor line.
   */
  let matches: StandardizedLine[] = findMatches(configuration, line, lines);

  if (matches.length === 0 || (tiebreaker === 'second' && matches.length < 2)) {
    throw new Error(`Failed to find "${tiebreaker}" match at "${position}" position of anchor "${anchor}"`)
  }

  if (tiebreaker === 'first') {
    return matches[0];
  } 
  
  if (tiebreaker === 'second') {
    return matches[1];
  }

  return matches[matches.length - 1];
};

/**
 * Returns a tuple containing page and line indices of first occurence of anchor line within text.
 * Works as proof of concept, but a better solution would need to handle multiple occurences of an anchor line.
 */
export const findAnchorPosition = (pages: StandardizedPage[], anchorLine: string): [number, number] => {
  let page!: number;
  let line!: number;
   
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

/**
 * Starting from anchor position, scans left or right for matches.
 */
const findMatches = (
  configuration: Row,
  anchorLineIndex: number,
  lines: StandardizedLine[],
): StandardizedLine[] => {
  const { position } = configuration;
  const anchorBounds = lines[anchorLineIndex].boundingPolygon;
  const tolerance = 0.08; // https://docs.sensible.so/docs/row
  
  const matches: StandardizedLine[] = [];

  if (position === 'right') {
    const anchorTopBoundary = anchorBounds[TOP_RIGHT].y;
    let currentLine = anchorLineIndex + 1;
    while (
      Math.abs(anchorTopBoundary - lines[currentLine].boundingPolygon[TOP_RIGHT].y) <= tolerance && 
      currentLine < lines.length
    ) {
      matches.push(lines[currentLine]);
      currentLine += 1;
    }
  } else {
    const anchorTopBoundary = anchorBounds[TOP_RIGHT].y;
    let currentLine = anchorLineIndex - 1;
    while (
      Math.abs(anchorTopBoundary - lines[currentLine].boundingPolygon[TOP_RIGHT].y) <= tolerance && 
      currentLine >= 0
    ) {
      matches.push(lines[currentLine]);
      currentLine -= 1;
    }
  } 

  return matches;
};
