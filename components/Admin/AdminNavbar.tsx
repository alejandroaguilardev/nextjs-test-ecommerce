import { useContext, } from 'react';
import NextLink from 'next/link'
import { AppBar, Box, Toolbar, Typography, Button } from '@mui/material'
import { UIContext } from '../../context'

export const AdminNavbar = () => {
    const { toggleSideMenu } = useContext(UIContext);

    return (
        <AppBar>
            <Toolbar>
                <NextLink href='/' passHref>
                    <Box display='flex' alignItems='center'>
                        <Typography variant='h6'>Teslo</Typography>
                        <Typography sx={{ ml: 0.5 }}>Shop</Typography>
                    </Box>
                </NextLink>

                <Box flex={1} />

                <Button onClick={toggleSideMenu}>
                    Menú
                </Button>

            </Toolbar>

        </AppBar>
    )
}
