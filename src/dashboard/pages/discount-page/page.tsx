import React, { useState } from "react";
import {
    Page,
    Card,
    Text,
    Heading,
    Button,
    Image,
    Input,
    FormField,
    Box,
    WixDesignSystemProvider
} from "@wix/design-system";
import { dashboard } from "@wix/dashboard";
import { applyDiscountToProduct } from "../../../services/product-service";
import { useMostExpensiveProduct } from "../../../hooks/useProductsQuery";
import { MostExpensiveProductCard } from "../../../components/MostExpensiveProductCard";

export const DiscountDashboardPage = () => {
    const { product, isLoading, error, refetch } = useMostExpensiveProduct();
    const [discountPercentage, setDiscountPercentage] = useState("10");
    const [isApplying, setIsApplying] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const applyDiscount = async () => {
        if (!product) {
            setSuccessMessage("No product selected");
            return;
        }

        if (!product.id) {
            setSuccessMessage("Product ID is missing");
            return;
        }

        const discount = Number(discountPercentage);
        if (isNaN(discount) || discount <= 0 || discount > 99) {
            setSuccessMessage("Discount must be between 1 and 99");
            return;
        }
        if (isApplying) {
            setSuccessMessage("Already applying discount");
            return;
        }

        setIsApplying(true);
        setSuccessMessage(null);

        try {
            await applyDiscountToProduct(
                product.id,
                Number(discountPercentage)
            );
            await refetch();
            dashboard.showToast({
                message: "Great! The discount has been applied.",
                type: "success"
            });
            setTimeout(() => {
                dashboard.navigateBack();
            }, 2000);
        } catch (err) {
            console.error("Error applying discount:", err);
            setSuccessMessage("Failed to apply discount. Please try again.");
        } finally {
            setIsApplying(false);
        }
    };

    if (isLoading || error || !product) {
        const message = isLoading
            ? "Loading..."
            : error
            ? "Error loading product"
            : "No non-discounted products found";

        return (
            <Page>
                <Page.Header title='Product Discounter' />
                <Page.Content>
                    <Text>{message}</Text>
                </Page.Content>
            </Page>
        );
    }

    return (
        <WixDesignSystemProvider>
            <Page>
                <Page.Header
                    title='Product Discounter'
                    subtitle='Give people a break on your most expensive product'
                    showBackButton={true}
                    onBackClicked={dashboard.navigateBack}
                />
                <Page.Content>
                    <Box
                        backgroundColor='white'
                        borderRadius='8px'
                        padding='24px'
                    >
                        <MostExpensiveProductCard
                            product={product}
                            isLoading={isLoading}
                            error={!!error}
                            showInput={true}
                            discountValue={discountPercentage}
                            onDiscountChange={setDiscountPercentage}
                            onActionClick={applyDiscount}
                            isActionLoading={isApplying}
                            actionLabel='Apply discount'
                        />
                    </Box>
                </Page.Content>
            </Page>
        </WixDesignSystemProvider>
    );
};

export default DiscountDashboardPage;
