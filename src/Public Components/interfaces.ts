import React from "react";

export interface CardProps {
  width: string;
  height: string;
  position: string;
  path: string;
  alt: string;
  style?: React.CSSProperties;
  marginTop?: string;
  marginBottom?: string;
  marginLeft?: string;
  marginRight?: string;
}
