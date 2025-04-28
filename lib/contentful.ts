import * as contentful from "contentful";
import { Asset, Entry } from "contentful";
import { type Document as RichTextDocument } from "@contentful/rich-text-types";
import { Product, CarouselItem } from "./types";

const spaceId = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

if (!spaceId || !accessToken) {
  throw new Error(
    "Contentful environment variables (SPACE_ID, ACCESS_TOKEN) are missing."
  );
}

export const contentfulClient = contentful.createClient({
  space: spaceId,
  accessToken: accessToken,
});

function transformContentfulProduct(entry: Entry): Product | null {
  const fields = entry.fields;

  const imageUrlAsset = fields.imageUrl as Asset | undefined;
  const imageUrl = imageUrlAsset?.fields?.file?.url;

  if (!imageUrl || typeof imageUrl !== "string") {
    console.warn(
      `Product entry ${entry.sys.id} ('${
        fields.name ?? "N/A"
      }') missing valid image URL.`
    );
    return null;
  }

  const id = (fields.id as string) ?? entry.sys.id;
  const name = (fields.name as string) ?? "Unnamed Product";
  const slug = (fields.slug as string) ?? entry.sys.id;
  const price = (fields.price as number) ?? 0;

  const descriptionData = fields.description as RichTextDocument | undefined;

  return {
    contentfulId: entry.sys.id,
    id: id,
    name: name,
    slug: slug,
    price: price,
    description: descriptionData,
    imageUrl: imageUrl.startsWith("//") ? `https:${imageUrl}` : imageUrl,
  };
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const entries = await contentfulClient.getEntries({
      content_type: "product",
      include: 1,
    });
    if (entries.items) {
      return entries.items
        .map(transformContentfulProduct)
        .filter((product): product is Product => product !== null);
    }
    return [];
  } catch (error) {
    console.error("Error fetching all products:", error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const entries = await contentfulClient.getEntries({
      content_type: "product",
      "fields.slug": slug,
      limit: 1,
      include: 1,
    });
    if (entries.items && entries.items.length > 0) {
      return transformContentfulProduct(entries.items[0]);
    }
    return null;
  } catch (error) {
    console.error(`Error fetching product by slug "${slug}":`, error);
    return null;
  }
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (!ids || ids.length === 0) {
    return [];
  }
  try {
    const entries = await contentfulClient.getEntries({
      content_type: "product",
      "fields.id[in]": ids.join(","),
      include: 1,
      limit: ids.length,
    });

    if (entries.items) {
      return entries.items
        .map(transformContentfulProduct)
        .filter((product): product is Product => product !== null);
    }
    return [];
  } catch (error) {
    console.error(
      `Error fetching products by IDs [${ids.join(",")}] from Contentful:`,
      error
    );
    return [];
  }
}

export async function getProductsForCarousel(
  limit: number = 8
): Promise<CarouselItem[]> {
  try {
    console.log(`Fetching ${limit} products (name, image) for carousel...`);
    const entries = await contentfulClient.getEntries({
      content_type: "product",
      select: ["fields.name", "fields.imageUrl"],
      include: 1,
      limit: limit,
    });

    console.log(`Fetched ${entries.items.length} raw entries for carousel.`);

    if (entries.items) {
      return entries.items
        .map((entry) => {
          const fields = entry.fields;
          const name = fields.name ?? "Unnamed Product";
          const imageUrlAsset = fields.imageUrl as Asset | undefined;
          const imageUrl = imageUrlAsset?.fields?.file?.url;

          if (imageUrl && typeof imageUrl === "string") {
            return {
              imageUrl: imageUrl.startsWith("//")
                ? `https:${imageUrl}`
                : imageUrl,
              alt: name,
              contentfulId: entry.sys.id,
            };
          } else {
            console.warn(
              `Carousel item ${entry.sys.id} ('${name}') missing valid image URL.`
            );
            return null;
          }
        })
        .filter((item): item is CarouselItem => item !== null);
    }
    return [];
  } catch (error) {
    console.error(
      "Error fetching products for carousel from Contentful:",
      error
    );
    return [];
  }
}
