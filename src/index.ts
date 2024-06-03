import { labelExtractor } from './labelExtractor';
import { rowExtractor } from './rowExtractor';
import { StandardizedText, Row, Label } from './types'
import fs from 'fs';

const data = fs.readFileSync('./src/standardized_text.json', { encoding: 'utf-8' });
const json: StandardizedText = JSON.parse(data);

function main(configuration: Row | Label) {
  if (configuration.id === 'label') {
    const result = labelExtractor(configuration, json);
    console.log('LABEL EXTRACTION RESULT', result);
  }

  if (configuration.id === 'row') {
    const result = rowExtractor(configuration, json)
    console.log('ROW EXTRACTION RESULT', result);
  }
}

const labelConfiguration: Label = {
  id: 'label', 
  position: 'below',
  textAlignment: 'left',
  anchor: 'distance'
};

const rowConfiguration: Row = {
  id: "row",
  position: "right",
  tiebreaker: "first",
  anchor: "line haul"
}

main(labelConfiguration);