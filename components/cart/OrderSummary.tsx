import { FC, useContext } from 'react';
import { Grid, Typography } from "@mui/material"
import { CartContext } from '../../context';
import { currency } from '../../utils';
import { IOrder } from '../../interfaces/order';

interface Props {
    orderValues?: {
        subTotal: number;
        tax: number;
        total: number;
        numberOfItems: number;
    }
}

export const OrderSummary: FC<Props> = ({ orderValues }) => {
    const cart = useContext(CartContext);

    const summaryValues = orderValues ? orderValues : cart;

    const { subTotal, tax, total, numberOfItems } = summaryValues;

    return (
        <Grid container>

            <Grid item xs={6}>
                <Typography>No. Productos</Typography>
            </Grid>

            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{numberOfItems} {numberOfItems > 0 ? 'Productos' : 'Producto'}</Typography>
            </Grid>

            <Grid item xs={6}>
                <Typography>Subtotal</Typography>
            </Grid>

            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{currency.format(subTotal)}</Typography>
            </Grid>

            <Grid item xs={6}>
                <Typography>Impuestos ({Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100}%)</Typography>
            </Grid>

            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{currency.format(tax)}</Typography>
            </Grid>

            <Grid item xs={6} sx={{ mt: 2 }}>
                <Typography variant="subtitle1">Total:</Typography>
            </Grid>

            <Grid item xs={6} display='flex' justifyContent='end' sx={{ mt: 2 }}>
                <Typography variant="subtitle1">{currency.format(total)}</Typography>
            </Grid>

        </Grid>
    )
}
