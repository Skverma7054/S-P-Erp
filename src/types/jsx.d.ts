import React from "react";

declare module "react" {
  interface Attributes {
    [key: string]: any;
  }
}
