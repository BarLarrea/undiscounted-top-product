// src/services/product-service.ts
import { products } from "@wix/stores";

export interface Product {
    id: string;
    name: string;
    price: number;
    currency: string;
    imageUrl: string;
    description: string;
}

// Function to get the most expensive non-discounted product

export async function getMostExpensiveNonDiscountedProduct(): Promise<Product | null> {
    try {
        const response = await products.queryProducts().limit(100).find();

        if (!response.items?.length) return null;

        const nonDiscountedProducts = response.items.filter(
            (product) =>
                product.priceData?.price != null &&
                (!product.priceData.discountedPrice ||
                    product.priceData.discountedPrice >=
                        product.priceData.price)
        );

        if (nonDiscountedProducts.length === 0) return null;

        nonDiscountedProducts.sort((a, b) => {
            const priceA = a.priceData?.price ?? 0;
            const priceB = b.priceData?.price ?? 0;
            return priceB - priceA;
        });

        const topProduct = nonDiscountedProducts[0];

        return {
            id: topProduct._id ?? "000",
            name: topProduct.name ?? "Unnamed Product",
            price: topProduct.priceData?.price ?? 0,
            currency: topProduct.priceData?.currency ?? "USD",
            imageUrl:
                topProduct.media?.mainMedia?.image?.url ?? "/placeholder.svg",
            description: topProduct.description ?? ""
        };
    } catch (error) {
        console.error("Error fetching products:", error);
        return null;
    }
}

// Function to apply a discount to a product
export async function applyDiscountToProduct(
    productId: string,
    discountPercentage: number
): Promise<boolean> {
    try {
        const response = (await products.getProduct(productId)) as any;
        const product = response.product;

        const originalPrice = product.priceData?.price;

        if (!originalPrice || typeof originalPrice !== "number") {
            throw new Error("Invalid or missing product price");
        }

        const discountedPrice = Number(
            (originalPrice * (1 - discountPercentage / 100)).toFixed(2)
        );

        await products.updateProduct(productId, {
            priceData: {
                discountedPrice: discountedPrice
            },
            discount: {
                type: "PERCENT" as string,
                value: discountPercentage
            } as any
        });

        console.log("Discount applied successfully");
        console.log(
            `Applying discount: ${originalPrice} -> ${discountedPrice}`
        );
        return true;
    } catch (error) {
        console.error("Error applying discount:", error);
        return false;
    }
}
