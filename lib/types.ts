import { type Document as RichTextDocument } from "@contentful/rich-text-types";

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
}

export interface CartItemDetails extends CartItem {
  product: Product;
  lineTotal: number;
}

export interface ProductPageProps {
  params: Promise<{ productId: string }>;
}

export interface AddToCartButtonProps {
  productId: string;
}

export interface CartItemControlsProps {
  productId: string;
  initialQuantity: number;
}

export interface CarouselItem {
  imageUrl: string;
  alt: string;
  contentfulId: string;
}

export interface ProductCarouselProps {
  items: CarouselItem[];
}

export interface ProductCardProps {
  product: Product;
}

export interface ProductDetailsProps {
  product: Product;
}

export interface CartActionState {
  success: boolean;
  message: string;
  error?: { formErrors?: string[] };
  cartId?: string;
}

export interface Product {
  contentfulId: string;
  id: string;
  name: string;
  slug: string;
  price: number;
  description?: RichTextDocument;
  imageUrl: string;
}

export interface CarouselItem {
  imageUrl: string;
  alt: string;
  contentfulId: string;
}
