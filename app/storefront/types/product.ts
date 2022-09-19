export interface Product {
  id: string;
  variants: ProductVariant[];
  name: string;
  description: string;
  image: {
    url: string;
    alt: string;
  };
  breadcrumbs: {
    id: string;
    name: string;
    href?: string;
  }[];
  details: string[];
}

export interface ProductVariant {
  id: string;
  name: string;
  inStock: boolean;
  price: number;
}
