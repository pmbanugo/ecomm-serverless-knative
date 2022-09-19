export interface LocalCart {
  token: string;
  quantity: number;
}

export interface Cart {
  readonly id: string;
  readonly email: string;
  readonly token: string;
  readonly totalPrice: number;
  readonly quantity: number;
  readonly lineItems: LineItem[];
}

export interface LineItem {
  readonly id: string;
  variant: {
    variantName: string;
    productName: string;
    productId: string;
    thumbnail: {
      url: string;
      alt: string;
    };
    price: number;
  };
  readonly totalPrice: number;
  readonly quantity: number;
}

// export interface ProductVariant {
//   readonly id: number;
//   readonly sku?: string;
//   readonly key?: string;
//   readonly attributes?: Attribute[];
//   readonly price?: Price;
//   readonly images: Image[];
// }
