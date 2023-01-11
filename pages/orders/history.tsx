import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { ShopLayout } from '../../components/layouts/ShopLayout';
import { Typography, Grid, Chip } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { getSession } from 'next-auth/react';
import { IOrder } from '../../interfaces';
import { dbOrders } from '../../database';


interface Props {
    orders: IOrder[]
}

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'fullname', headerName: 'Nombre Completo', width: 300 },
    {
        field: 'paid',
        headerName: 'Pagada',
        description: "Muestra inormación si esta pagada la orden no",
        width: 200,
        renderCell: (params) => {
            return (
                params.row.paid ?
                    <Chip color="success" label="Pagada" variant='outlined' />
                    : <Chip color="error" label="No Pagado" variant='outlined' />
            )
        }
    },
    {
        field: 'orden',
        headerName: 'Ver orden',
        width: 200,
        sortable: false,
        renderCell: (params) => {
            return (
                <Link href={`/orders/${params.row.orderId}`} passHref>
                    Ver Orden
                </Link>
            )
        }
    },
]


const HistoryPage: NextPage<Props> = ({ orders }) => {

    const rows = orders.map((order, i) => ({
        id: i + 1,
        paid: order.isPaid,
        fullname: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
        orderId: order._id
    }));

    return (
        <ShopLayout title='Historial de ordenes' pageDescription='Historial de ordenes del cliente'>
            <Typography variant='h1' component='h1'>Historial de ordenes</Typography>

            <Grid container>
                <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                    />
                </Grid>

            </Grid>

        </ShopLayout>
    )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const session: any = await getSession({ req });

    if (!session) {
        return {
            redirect: {
                destination: `/auth/login?p=/order/history`,
                permanent: false
            }
        }
    }

    const orders = await dbOrders.getOrdersByUser(session.user._id);

    return {
        props: {
            orders
        }
    }
}

export default HistoryPage