import Link from "next/link"
import { useForm } from 'react-hook-form';
import { Box, Grid, Typography, TextField, Button, Chip } from "@mui/material"
import { AuthLayout } from "../../components/layouts"
import { useState, useContext } from 'react';
import { ErrorOutline } from "@mui/icons-material";
import { validations } from "../../utils";
import { AuthContext } from "../../context";
import { useRouter } from 'next/router';
import { signIn, getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';

type FormData = {
  name: string,
  email: string,
  password: string,
};

const RegisterPage = () => {
  const router = useRouter();
  const { registerUser } = useContext(AuthContext);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();

  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const onRegisterForm = async ({ email, password, name }: FormData) => {
    setShowError(false);

    const { hasError, message } = await registerUser(name, email, password)
    if (hasError) {
      setShowError(true);
      setErrorMessage(message || '')
      setTimeout(() => {
        setShowError(false)
      }, 3000);
      return;
    }

    //   const destination = router.query.page?.toString() || '/';
    //   router.replace(destination);

    await signIn('credentials', { email, password })


  }


  return (
    <AuthLayout title='Registro'>
      <form onSubmit={handleSubmit(onRegisterForm)}>
        <Box sx={{ width: 350, padding: '10px 20px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} >
              <Typography variant='h1' component='h1' align="center">Crear Cuenta</Typography>
              <Chip
                label="No se pudo crear el usuario"
                color='error'
                icon={<ErrorOutline />}
                className="fadeIn"
                sx={{ display: showError ? 'flex' : 'none' }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField label="Nombre Completo" variant="filled" fullWidth
                {...register('name', {
                  required: 'Este campo es requerido',
                  minLength: { value: 2, message: 'Mínimo 2 caracteres' }


                })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField label="Correo" type="email" variant="filled" fullWidth
                {...register('email', {
                  required: 'Este campo es requerido',
                  validate: validations.isEmail
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField label="Contraseña" type='password' variant="filled" fullWidth
                {...register('password', {
                  required: 'Este campo es requerido',
                  minLength: { value: 6, message: 'Mínimo 6 caracteres' }


                })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" color="secondary" className="circular-btn" size="large" fullWidth>Registrar</Button>
            </Grid>

            <Grid item xs={12} display='flex' justifyContent='end' >
              <Link href={router.query.page ? `/auth/login?page=${router.query.page?.toString()}` : '/auth/login'} passHref>
                ¿Ya tienes cuenta?
              </Link>
            </Grid>
          </Grid>

        </Box>
      </form>
    </AuthLayout>
  )
}


export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const session = await getSession({ req });
  const { p = '/' } = query;

  if (session) {
    return {
      redirect: {
        destination: p.toString(),
        permanent: false
      }
    }
  }

  return {
    props: {

    }
  }
}


export default RegisterPage