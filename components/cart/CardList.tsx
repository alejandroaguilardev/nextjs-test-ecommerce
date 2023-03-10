import { FC, useContext } from 'react';
import Link from "next/link"
import { Box, Button, CardActionArea, CardMedia, Grid, Typography } from "@mui/material"
import { CartContext } from "../../context";
import { ItemCounter } from "../ui"
import { ICartProduct } from '../../interfaces/cart';
import { IOrderItem } from '../../interfaces';

interface Props {
    editable?: boolean;
    products?: IOrderItem[];
}

export const CardList: FC<Props> = ({ editable, products = [] }) => {
    const { cart, updatedCartQuantity, removeCartProduct } = useContext(CartContext);

    const onUpdateQuantityValue = (product: ICartProduct, newQuantityValue: number) => {
        product.quantity = newQuantityValue;
        updatedCartQuantity(product);
    }

    const productsToShow = products.length > 0 ? products : cart;

    return (
        <>
            {
                productsToShow.map(product => (
                    <Grid container key={product.slug + product.size} sx={{ mb: 1 }}>
                        <Grid item xs={3}>
                            <Link href={`/product/${product.slug}`}>
                                <CardActionArea>
                                    <CardMedia
                                        image={`${product.image}`}
                                        component='img'
                                        sx={{ borderRadius: '5px' }}
                                    />
                                </CardActionArea>
                            </Link>
                        </Grid>
                        <Grid item xs={7}>
                            <Box display='flex' flexDirection='column'>
                                <Typography variant="body1">{product.title}</Typography>
                                <Typography variant="body1">Talla: <strong>{product.size}</strong></Typography>
                                {
                                    editable ?
                                        <ItemCounter
                                            currentValue={product.quantity}
                                            updatedQuantity={(value) => onUpdateQuantityValue(product as ICartProduct, value)}
                                            maxValue={10}
                                        />
                                        :
                                        <Typography variant="h6">{product.quantity} {product.quantity > 1 ? 'productos' : 'producto'}</Typography>
                                }
                            </Box>
                        </Grid>
                        <Grid item xs={2} display='flex' alignItems='center' flexDirection='column'>
                            <Typography variant='subtitle1'>{`$${product.price}`}</Typography>
                            {
                                editable
                                &&
                                <Button variant="text" color='secondary'
                                    onClick={() => removeCartProduct(product as ICartProduct)}
                                >
                                    Remover
                                </Button>
                            }
                        </Grid>
                    </Grid>
                ))
            }
        </>
    )
}
