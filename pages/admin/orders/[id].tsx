import { CreditScoreOutlined, CreditCardOffOutlined } from "@mui/icons-material";
import { Typography, Chip, Grid, Card, CardContent, Divider, Box, CircularProgress } from "@mui/material";
import { NextPage, GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { tesloApi } from "../../../api";
import { CardList, OrderSummary } from "../../../components/cart";
import { ShopLayout } from "../../../components/layouts";
import { dbOrders } from "../../../database";
import { IOrder } from "../../../interfaces";
import { countries } from "../../../utils";
import { OrderResponseBody } from "../../orders/[id]";


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

                                            <Chip
                                                sx={{ my: 2 }}
                                                label='Orden Pendiente'
                                                variant='outlined'
                                                color='error'
                                                icon={<CreditScoreOutlined />}
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


    return {
        props: {
            order
        }
    }
}

export default OrdersPage