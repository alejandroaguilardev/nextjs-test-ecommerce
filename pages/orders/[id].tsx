import { useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { Typography, Grid, Card, CardContent, Divider, Box, Button, Chip, CircularProgress } from "@mui/material"
import { CreditScoreOutlined, CreditCardOffOutlined } from '@mui/icons-material';
import { CardList, OrderSummary } from "../../components/cart"
import { ShopLayout } from "../../components/layouts"
import { getSession } from 'next-auth/react';
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces/order';
import { countries } from '../../utils';
import { tesloApi } from '../../api';

export type OrderResponseBody = {
    id: string;
    status:
    | "COMPLETED"
    | "SAVED"
    | "APPROVED"
    | "VOIDED"
    | "COMPLETED"
    | "PAYER_ACTION_REQUIRED";
};

interface Props {
    order: IOrder
}

const OrdersPage: NextPage<Props> = ({ order }) => {
    const router = useRouter();
    const [isPaying, setIsPaying] = useState(false)
    const { shippingAddress, orderItems } = order;

    const onOrderCompleted = async (details: OrderResponseBody) => {
        if (details.status !== 'COMPLETED') {
            return alert('No hay pago en Paypal')
        }
        setIsPaying(true);

        try {
            const { data } = await tesloApi.post(`/orders/pay`, {
                orderId: order._id,
                transactionId: details.id,
            })

            router.reload()

        } catch (error) {
            setIsPaying(false);
            console.log(error);
            alert('Error');
        }

    }

    return (
        <ShopLayout title={`Resumen de orden ${order._id}`} pageDescription="Resumen de la orden">
            <Typography variant="h1" component="h1">Orden: {order._id}</Typography>
            {
                order.isPaid ?
                    <Chip
                        sx={{ my: 2 }}
                        label='Orden ya fue pagada'
                        variant='outlined'
                        color='success'
                        icon={<CreditScoreOutlined />}
                    />
                    :
                    <Chip
                        sx={{ my: 2 }}
                        label='Pendiente de pago'
                        variant='outlined'
                        color='error'
                        icon={<CreditCardOffOutlined />}
                    />

            }


            <Grid container className='fadeIn'>
                <Grid item xs={12} sm={7}>
                    <CardList
                        products={orderItems}
                    />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Card className="summary-card">
                        <CardContent>
                            <Typography variant="h2">Resumen ({order.numberOfItems > 1 ? 'Productos' : 'Producto'})</Typography>
                            <Divider sx={{ my: 1 }} />

                            <Typography variant="subtitle1"> Dirección de entrega</Typography>
                            <Typography > {shippingAddress.firstName} {shippingAddress.lastName}</Typography>
                            <Typography > {shippingAddress.address} {shippingAddress.address2 ? `,${shippingAddress.address2}` : ''} </Typography>
                            <Typography > {shippingAddress.city}</Typography>
                            <Typography >
                                {countries.find(country => shippingAddress.country === country.code)?.name}
                            </Typography>
                            <Typography > {shippingAddress.phone}</Typography>

                            <Divider sx={{ my: 1 }} />

                            <OrderSummary
                                orderValues={{
                                    subTotal: order.subTotal,
                                    tax: order.tax,
                                    total: order.total,
                                    numberOfItems: order.numberOfItems
                                }}
                            />

                            <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
                                <Box display="flex" justifyContent="center" className='fadeIn'
                                    sx={{ display: isPaying ? 'flex' : 'none' }}
                                >
                                    <CircularProgress />
                                </Box>
                                <Box sx={{ display: isPaying ? 'none' : 'flex', flex: 1 }} flexDirection='column'>
                                    {
                                        order.isPaid ?

                                            <Chip
                                                sx={{ my: 2 }}
                                                label='Orden ya fue pagada'
                                                variant='outlined'
                                                color='success'
                                                icon={<CreditScoreOutlined />}
                                            />
                                            :
                                            <PayPalButtons
                                                createOrder={(data, actions) => {
                                                    return actions.order.create({
                                                        purchase_units: [
                                                            {
                                                                amount: {
                                                                    value: `${order.total}`,
                                                                },
                                                            },
                                                        ],
                                                    });
                                                }}
                                                onApprove={(data, actions: any) => {
                                                    return actions.order.capture().then((details: any) => {
                                                        onOrderCompleted(details);
                                                    });
                                                }}
                                            />
                                    }
                                </Box>

                            </Box>

                        </CardContent>

                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>
    )
}


export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
    const { id = '' } = query;
    const session: any = await getSession({ req });

    if (!session) {
        return {
            redirect: {
                destination: `/auth/login?p=/orders/${id}`,
                permanent: false,
            }
        }
    }

    const order = await dbOrders.getOrderById(id.toString());

    if (!order) {
        return {
            redirect: {
                destination: `/orders/history`,
                permanent: false,
            }
        }
    }

    if (order?.user !== session.user._id) {
        return {
            redirect: {
                destination: `/orders/history`,
                permanent: false,
            }
        }
    }

    return {
        props: {
            order
        }
    }
}

export default OrdersPage