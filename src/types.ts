export type HorizontalDirection = "right" | "left";
export type VerticalDirection = "below" | "above";
export type Direction = HorizontalDirection | VerticalDirection;

export interface BaseMethod {
  id: string;
}

export interface Label extends BaseMethod {
  id: "label";
  position: Direction;
  textAlignment: HorizontalDirection;
  anchor: string;
}

export interface Row extends BaseMethod {
  id: "row";
  position: HorizontalDirection;
  tiebreaker: "first" | "second" | "last";
  anchor: string;
}

export type Polygon = { x: number; y: number }[];

export type StandardizedLine = {
  text: string;
  boundingPolygon: Polygon;
};

export type StandardizedPage = {
  lines: StandardizedLine[];
};

export type StandardizedText = {
  pages: StandardizedPage[];
};

export type LabelExtractor = (
  configuration: Label,
  text: StandardizedText
) => StandardizedLine | StandardizedLine[];

export type RowExtractor = (
  configuration: Row,
  text: StandardizedText
) => StandardizedLine;

// Indices of vertices in bounding polygon

//  UL-----UR
//  |      |
//  LL-----LR
//
export const TOP_LEFT = 0;
export const TOP_RIGHT = 1;
export const BOTTOM_RIGHT = 2;
export const BOTTOM_LEFT = 3;