import type { FinderFunction, FinderSeries, FinderUnit } from "./match";
import type { GasComponent } from "./mixture";
import type { PressureUnit } from "./pressure";

export type GasMode = "pure" | "mixture";

export type ProductFinderInitial = {
  fn?: FinderFunction;
  gas?: string;
  flow?: number;
  unit?: FinderUnit;
  series?: FinderSeries;
  gasMode?: GasMode;
  components?: GasComponent[];
  pressure?: number;
  pressureUnit?: PressureUnit;
};
