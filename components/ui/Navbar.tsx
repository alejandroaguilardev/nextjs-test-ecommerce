import NextLink from 'next/link'
import { AppBar, Box, Toolbar, Typography, Button, IconButton, Badge, Input, InputAdornment } from '@mui/material'
import { ClearOutlined, SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react';
import { CartContext, UIContext } from '../../context'

export const Navbar = () => {
  const { asPath, push } = useRouter();
  const { toggleSideMenu } = useContext(UIContext);
  const { numberOfItems } = useContext(CartContext);

  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const onSearchTerm = () => {
    if (searchTerm.trim().length === 0) return;
    push(`/search/${searchTerm}`)
  }

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

        <Box sx={{ display: isSearchVisible ? 'none' : { xs: 'none', sm: "flex" } }} className='fadeIn'>
          <NextLink
            href='/category/men'
            passHref
          >
            <Box>
              <Button color={asPath === '/category/men' ? 'primary' : 'info'}>Hombres</Button>
            </Box>
          </NextLink>

          <NextLink href='/category/women' passHref>
            <Box>
              <Button color={asPath === '/category/women' ? 'primary' : 'info'}>Mujeres</Button>
            </Box>
          </NextLink>

          <NextLink href='/category/kid' passHref>
            <Box>
              <Button color={asPath === '/category/kid' ? 'primary' : 'info'}>Niños</Button>
            </Box>
          </NextLink>
        </Box>

        <Box flex={1} />


        <IconButton
          sx={{ display: { xs: 'flex', sm: 'none' } }}
          onClick={toggleSideMenu}
        >
          <SearchOutlined />
        </IconButton>


        {
          isSearchVisible ?
            <Input
              sx={{ display: { xs: 'none', sm: 'flex' } }}

              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' ? onSearchTerm() : null}
              type='text'
              placeholder="Buscar..."
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setIsSearchVisible(false)}
                  >
                    <ClearOutlined />
                  </IconButton>
                </InputAdornment>
              }
            />
            :
            <IconButton
              sx={{ display: { xs: 'none', sm: 'flex' } }}
              className='fadeIn'
              onClick={() => setIsSearchVisible(true)}

            >
              <SearchOutlined />
            </IconButton>
        }

        <NextLink href='/cart' passHref>
          <IconButton>
            <Badge badgeContent={numberOfItems > 9 ? '+9' : numberOfItems} color='secondary'>
              <ShoppingCartOutlined />
            </Badge>
          </IconButton>
        </NextLink>

        <Button onClick={toggleSideMenu}>
          Menú
        </Button>

      </Toolbar>

    </AppBar>
  )
}
