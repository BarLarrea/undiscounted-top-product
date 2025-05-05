import React, { useState } from "react";
import { Page, Text, Box, WixDesignSystemProvider } from "@wix/design-system";
import { dashboard } from "@wix/dashboard";
import { applyDiscountToProduct } from "../../../services/product-service";
import { useMostExpensiveProduct } from "../../../hooks/useProductsQuery";
import { MostExpensiveProductCard } from "../../../components/MostExpensiveProductCard";
import "@wix/design-system/styles.global.css";


export const DiscountDashboardPage = () => {
    const { product, isLoading, error, refetch } = useMostExpensiveProduct();
    const [discountPercentage, setDiscountPercentage] = useState("10");
    const [isApplying, setIsApplying] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    const applyDiscount = async () => {
        if (!product?.id) {
            setStatusMessage("No product selected");
            return;
        }

        const discount = Number(discountPercentage);
        if (isNaN(discount) || discount <= 0 || discount > 99) {
            setStatusMessage("Discount must be between 1 and 99");
            return;
        }

        if (isApplying) {
            setStatusMessage("Already applying discount");
            return;
        }

        setIsApplying(true);
        setStatusMessage(null);

        try {
            await applyDiscountToProduct(product.id, discount);
            await refetch();

            dashboard.showToast({
                message: "Great! The discount has been applied.",
                type: "success"
            });

            // Wait for the success toast to be visible before navigating back
            setTimeout(() => {
                dashboard.navigateBack();
            }, 1500);
        } catch (err) {
            console.error("Error applying discount:", err);
            setStatusMessage("Something went wrong. Please try again.");
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
                        {statusMessage && (
                            <Box marginTop='12px'>
                                <Text>{statusMessage}</Text>
                            </Box>
                        )}
                    </Box>
                </Page.Content>
            </Page>
        </WixDesignSystemProvider>
    );
};

export default DiscountDashboardPage;
