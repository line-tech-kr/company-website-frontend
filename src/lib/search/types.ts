export type SearchEntry = {
  id: string;
  type: "product" | "category" | "page";
  title: string;
  model: string;
  productType?: "mfc" | "mfm";
  signal?: "digital" | "analogue" | "specialized";
  url: string;
  breadcrumb: string;
};
