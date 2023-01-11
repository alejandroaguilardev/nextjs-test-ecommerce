import { useState, useEffect } from 'react';
import { PeopleAltOutlined } from '@mui/icons-material';
import useSWR from 'swr';
import { Grid, Select, MenuItem } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { AdminLayout } from '../../components/layouts/AdminLayout';
import { IUser } from '../../interfaces';
import tesloApi from '../../api/tesloApi';

const UsersPage = () => {
    const { data, error } = useSWR<IUser[]>('/api/admin/users');
    const [users, setUsers] = useState<IUser[]>([]);

    useEffect(() => {
        if (data) {
            setUsers(data)
        }
    }, [data])


    if (!data && !error) return <></>;

    const onRoleUpdated = async (userId: string, newRole: string) => {
        const previosUsers = users.map(user => ({ ...user }));

        const updatedUsers = users.map(user => ({
            ...user,
            role: userId === user._id ? newRole : user.role
        }));

        setUsers(updatedUsers)
        try {
            await tesloApi.put('/admin/users', {
                userId, role: newRole
            })
        } catch (error) {
            console.log(error)
            alert('No se pudo actualizar el role del usuario');
            setUsers(previosUsers)
        }
    }

    const columns: GridColDef[] = [
        { field: 'email', headerName: 'Correo', width: 250 },
        { field: 'name', headerName: 'Nombre Completo', width: 300 },
        {
            field: 'role',
            headerName: 'Rol',
            width: 300,
            renderCell: ({ row }) => {

                return (
                    <Select
                        value={row.role}
                        label='Rol'
                        onChange={({ target }) => onRoleUpdated(row.id, target.value)}
                        sx={{ width: '300px' }}
                    >
                        <MenuItem value='admin'>Admin</MenuItem>
                        <MenuItem value='client'>Cliente</MenuItem>
                        <MenuItem value='super-user'>Super Usuario</MenuItem>
                        <MenuItem value='SEO'>SEO</MenuItem>

                    </Select>
                )
            }
        },
    ]

    const rows = users.map((user, i) => ({
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
    }));

    return (
        <AdminLayout
            title='Usuarios'
            subTitle='Mantenimiento de Usuarios'
            icon={<PeopleAltOutlined />}
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

export default UsersPage
