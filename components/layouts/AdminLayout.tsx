import { Box, Typography } from '@mui/material';
import { FC } from 'react';
import { AdminNavbar } from '../Admin';
import { SideMenu } from '../ui';


interface Props {
    children: JSX.Element | JSX.Element[];
    title: string;
    subTitle: string;
    icon?: JSX.Element;
}

export const AdminLayout: FC<Props> = ({ title, subTitle, icon, children }) => {
    return (
        <>
            <nav>
                <AdminNavbar />
            </nav>

            <SideMenu />

            <main style={{
                margin: '80px auto',
                maxWidth: '1440px',
                padding: '0 30px'
            }}>

                <Box display="flex" flexDirection='column'>
                    <Typography variant='h1' component='h1'>
                        {icon}
                        {title}
                    </Typography>
                    <Typography variant='h2' sx={{ mb: 1 }}>
                        {subTitle}
                    </Typography>

                </Box>
                <Box className='fadeIn'>
                    {children}
                </Box>
            </main>

        </>
    )
}
