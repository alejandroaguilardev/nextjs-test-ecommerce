import { useContext, useEffect, useState } from 'react';
import Link from "next/link"
import { Typography, Grid, Card, CardContent, Divider, Box, Button, Chip } from "@mui/material"
import { CardList, OrderSummary } from "../../components/cart"
import { ShopLayout } from "../../components/layouts"
import { CartContext } from "../../context";
import { countries } from '../../utils/countries';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

const SummaryPage = () => {
    const router = useRouter();
    const { numberOfItems, shippingAddress, createOrder } = useContext(CartContext);
    const [isPosting, setIsPosting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");


    useEffect(() => {
        if (!Cookies.get('firstName')) {
            router.push('/checkout/address')
        }

    }, [router]);

    const onCreateOrder = async () => {
        setIsPosting(true);
        const { hasError, message } = await createOrder();
        if (hasError) {
            setIsPosting(hasError)
            setErrorMessage(message)
            return;
        }


        router.replace(`/orders/${message}`)
    }



    if (!shippingAddress) {
        return <></>
    }

    const { firstName, lastName, address, address2, city, country, phone } = shippingAddress;

    return (
        <ShopLayout title="Resumen de orden" pageDescription="Resumen de la orden">
            <Typography variant="h1" component="h1">Resumen de la orden</Typography>
            <Grid container>
                <Grid item xs={12} sm={7}>
                    <CardList />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Card className="summary-card">
                        <CardContent>
                            <Typography variant="h2">Resumen ({numberOfItems} {numberOfItems === 1 ? 'Producto' : 'Productos'} )</Typography>
                            <Divider sx={{ my: 1 }} />

                            <Box display='flex' justifyContent='end' >
                                <Link href={'/checkout/address'}>
                                    Editar
                                </Link>
                            </Box>

                            <Typography variant="subtitle1"> Dirección de entrega</Typography>
                            <Typography > {firstName} {lastName}</Typography>
                            <Typography > {city}</Typography>
                            <Typography > {address} {address2 ? `, ${address2}` : ''}</Typography>
                            <Typography >  {countries.find(c => c.code === country)?.name}</Typography>
                            <Typography > {phone}</Typography>

                            <Divider sx={{ my: 1 }} />

                            <Box display='flex' justifyContent='end' >
                                <Link href={'/cart'}>
                                    Editar
                                </Link>
                            </Box>

                            <OrderSummary />

                            <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
                                <Button color='secondary' className='circular-btn' fullWidth onClick={onCreateOrder}
                                    disabled={isPosting}
                                >
                                    Confirmar Orden
                                </Button>

                                <Chip
                                    color='error'
                                    label={errorMessage}
                                    sx={{ display: errorMessage ? 'flex' : 'none', mt: 2 }}
                                />

                            </Box>

                        </CardContent>

                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>
    )
}

export default SummaryPage