export type SearchEntry = {
  id: string;
  type: "product" | "category" | "page";
  title: string;
  model: string;
  productType?: "mfc" | "mfm" | "epc" | "rou";
  signal?: "digital" | "analogue" | "specialized" | "lepc";
  url: string;
  breadcrumb: string;
};
