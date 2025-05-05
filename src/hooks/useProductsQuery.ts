import { useEffect, useState } from "react";
import {
    getMostExpensiveNonDiscountedProduct,
    Product
} from "../services/product-service";

export function useMostExpensiveProduct() {
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchProduct = async () => {
        try {
            setIsLoading(true);
            const data = await getMostExpensiveNonDiscountedProduct();
            setProduct(data);
        } catch (err) {
            setError(err as Error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, []);

    return { product, isLoading, error, refetch: fetchProduct };
}
