import { ConfirmationNumberOutlined } from "@mui/icons-material";
import { Chip, Grid } from "@mui/material";
import { GridColDef, DataGrid } from "@mui/x-data-grid";
import { AdminLayout } from "../../../components/layouts";
import { IOrder, IUser } from "../../../interfaces";
import useSWR from 'swr';


const columns: GridColDef[] = [
    { field: 'id', headerName: 'Order ID', width: 250 },
    { field: 'email', headerName: 'Correo', width: 250 },
    { field: 'name', headerName: 'Nombre Completo', width: 300 },
    { field: 'total', headerName: 'Monto Total', width: 300 },
    {
        field: 'isPaid',
        headerName: 'Pagada',
        renderCell: ({ row }) => {
            return row.isPaid ?
                <Chip variant='outlined' label='Pagada' color='success' />
                :
                <Chip variant='outlined' label='Pendiente' color='error' />
        }
    },
    { field: 'noProducts', headerName: 'No.Productos', align: 'center', width: 100 },
    {
        field: 'check',
        headerName: 'Ver Orden',
        renderCell: ({ row }) => {
            return (

                <a href={`/admin/orders/${row.id}`} target="_blank" rel="noreferrer">
                    Ver Orden
                </a>
            )
        }
    },
    { field: 'createdAt', headerName: 'Creada en', },

]

const OrdersPage = () => {
    const { data, error } = useSWR('/api/admin/orders');

    if (!data && !error) return <></>;


    const rows = data.map((order: IOrder) => ({
        id: order._id,
        email: (order.user as IUser).email,
        name: (order.user as IUser).name,
        total: order.total,
        isPaid: order.isPaid,
        noProducts: order.numberOfItems,
        createAt: order.createdAt,
    }));


    return (
        <AdminLayout
            title='Ordenes'
            subTitle='Mantenimiento de Ordenes'
            icon={<ConfirmationNumberOutlined />}
        >
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
        </AdminLayout>
    )
}

export default OrdersPage
