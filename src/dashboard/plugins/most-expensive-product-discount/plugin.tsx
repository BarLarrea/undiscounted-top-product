import React, { type FC } from "react";
import type { plugins } from "@wix/stores/dashboard";
import { WixDesignSystemProvider } from "@wix/design-system";
import { dashboard } from "@wix/dashboard";
import "@wix/design-system/styles.global.css";
import { useMostExpensiveProduct } from "../../../hooks/useProductsQuery";
import { MostExpensiveProductCard } from "../../../components/MostExpensiveProductCard";

type Props = plugins.Products.ProductsBannerParams;

const Plugin: FC<Props> = (props) => {
    const { product, isLoading, error } = useMostExpensiveProduct();

    const navigateToDashboardPage = () => {
        try {
            console.log("Navigating to dashboard page...");

            dashboard.navigate(
                { pageId: "57890c16-4c6a-4ae2-9551-49a6b1f2f7d7" },
                { displayMode: "main" }
            );

            console.log("Navigation command sent successfully");
        } catch (e) {
            console.error("Navigation error:", e);
        }
    };
    
    return (
        <WixDesignSystemProvider>
            <MostExpensiveProductCard
                product={product}
                isLoading={isLoading}
                error={!!error}
                actionLabel='Give people a break'
                onActionClick={navigateToDashboardPage}
            />
        </WixDesignSystemProvider>
    );
};

export default Plugin;


