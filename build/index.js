"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const labelExtractor_1 = require("./labelExtractor");
const rowExtractor_1 = require("./rowExtractor");
const fs_1 = __importDefault(require("fs"));
const data = fs_1.default.readFileSync('./src/standardized_text.json', { encoding: 'utf-8' });
const json = JSON.parse(data);
function main(configuration) {
    if (configuration.id === 'label') {
        const result = (0, labelExtractor_1.labelExtractor)(configuration, json);
        console.log('LABEL EXTRACTION RESULT', result);
    }
    if (configuration.id === 'row') {
        const result = (0, rowExtractor_1.rowExtractor)(configuration, json);
        console.log('ROW EXTRACTION RESULT', result);
    }
}
const labelConfiguration = {
    id: 'label',
    position: 'below',
    textAlignment: 'left',
    anchor: 'distance'
};
const rowConfiguration = {
    id: "row",
    position: "right",
    tiebreaker: "first",
    anchor: "line haul"
};
main(labelConfiguration);
