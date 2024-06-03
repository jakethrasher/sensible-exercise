import { labelExtractor } from './labelExtractor';
import { rowExtractor } from './rowExtractor';
import { Row, Label } from './types'
import * as json from './standardized_text.json';

const main = (configuration: Row | Label):void => {
  if (configuration.id === 'label') {
    const result = labelExtractor(configuration, json);
    console.log('LABEL EXTRACTION RESULT', result);
  }

  if (configuration.id === 'row') {
    const result = rowExtractor(configuration, json)
    console.log('ROW EXTRACTION RESULT', result);
  }
};

/**
 * Example 1: Label Method.
 * Anchor on "pickup notes" to extract a multi-line value.
 */
const labelConfiguration: Label = {
  id: 'label', 
  position: 'below',
  textAlignment: 'left',
  anchor: 'pickup notes'
};

/**
 * Example 2: Row Method.
 * Extract values to the right of an anchor line.
 */
const rowConfiguration: Row = {
  id: "row",
  position: "right",
  tiebreaker: "first",
  anchor: "price"
};

main(labelConfiguration);