import React from "react";
import {
    Card,
    Text,
    Box,
    Button,
    Image,
    Divider,
    Heading,
    Input,
    FormField
} from "@wix/design-system";
import { DiscountSmall } from "@wix/wix-ui-icons-common";

export interface MostExpensiveProductCardProps {
    product: {
        name: string;
        price: number;
        currency: string;
        imageUrl: string;
    } | null;
    isLoading: boolean;
    error: boolean;
    showInput?: boolean;
    discountValue?: string;
    onDiscountChange?: (value: string) => void;
    onActionClick?: () => void;
    actionLabel: string;
    isActionLoading?: boolean;
}

export const MostExpensiveProductCard: React.FC<
    MostExpensiveProductCardProps
> = ({
    product,
    isLoading,
    error,
    showInput = false,
    discountValue = "10",
    onDiscountChange,
    onActionClick,
    actionLabel,
    isActionLoading = false
}) => {
    return (
        <Card>
            <Card.Header
                title='Most expensive product'
                subtitle='This is the most expensive product that is not already discounted'
            />
            <Divider />
            <Card.Content size='medium'>
                <Box
                    backgroundColor='white'
                    borderRadius='6px'
                    padding='SP5'
                >
                    {isLoading && (
                        <Box
                            align='center'
                            padding='12px'
                        >
                            <Text>Loading...</Text>
                        </Box>
                    )}

                    {error && (
                        <Box
                            align='center'
                            padding='12px'
                        >
                            <Text>Error loading product</Text>
                        </Box>
                    )}

                    {!isLoading && !error && !product && (
                        <Box
                            align='center'
                            padding='10px'
                            direction='vertical'
                            gap='SP2'
                        >
                            <Text
                                weight='bold'
                                color='success'
                            >
                                All your products are already discounted! 🎉
                            </Text>
                            <Text
                                size='small'
                                secondary
                            >
                                There are currently no full-priced products to
                                display.
                            </Text>
                            <Text
                                size='small'
                                secondary
                            >
                                Try removing a discount or refresh to see a
                                product here.
                            </Text>
                        </Box>
                    )}

                    {!isLoading && !error && product && (
                        <Box
                            display='flex'
                            gap='SP6'
                        >
                            <Box
                                width='200px'
                                flexShrink={0}
                            >
                                <Image
                                    src={product.imageUrl || "/placeholder.svg"}
                                    alt={product.name || "Product image"}
                                    style={{
                                        width: "100%",
                                        height: "auto",
                                        objectFit: "contain",
                                        borderRadius: "6px",
                                        display: "block"
                                    }}
                                />
                            </Box>

                            <Box
                                flex={1}
                                paddingLeft='SP4'
                                direction='vertical'
                            >
                                <Box marginBottom='SP3'>
                                    <Text size='medium'>
                                        <Text weight='bold'>Product name:</Text>{" "}
                                        {product.name}
                                    </Text>
                                </Box>

                                <Box marginBottom='SP3'>
                                    <Heading appearance='H2'>
                                        {product.price.toFixed(2)}{" "}
                                        {product.currency}
                                    </Heading>
                                </Box>

                                {showInput && (
                                    <Box
                                        marginBottom='SP3'
                                        maxWidth='150px'
                                    >
                                        <FormField label='Discount %'>
                                            <Input
                                                value={discountValue}
                                                onChange={(e) =>
                                                    onDiscountChange?.(
                                                        e.target.value
                                                    )
                                                }
                                                type='number'
                                                min={1}
                                                max={99}
                                            />
                                        </FormField>
                                    </Box>
                                )}

                                <Box marginTop='SP3'>
                                    <Button
                                        prefixIcon={<DiscountSmall />}
                                        onClick={onActionClick}
                                        disabled={isActionLoading}
                                        priority='primary'
                                        size='large'
                                    >
                                        {isActionLoading
                                            ? "Applying..."
                                            : actionLabel}
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    )}
                </Box>
            </Card.Content>
        </Card>
    );
};

export default MostExpensiveProductCard;
