import { useRouter } from 'next/router';
import { ErrorOutline } from "@mui/icons-material";
import { Box, Button, Chip, Divider, Grid, TextField, Typography } from "@mui/material"
import Link from "next/link"
import { useForm } from "react-hook-form";
// import { tesloApi } from "../../api";
import { AuthLayout } from "../../components/layouts"
import { validations } from "../../utils";
import { useState, useContext, useEffect } from 'react';
// import { AuthContext } from '../../context/auth/AuthContext';
import { getProviders, getSession, signIn } from "next-auth/react";
import { GetServerSideProps } from 'next'

type FormData = {
    email: string,
    password: string,
};

const LoginPage = () => {
    const router = useRouter();

    // const { loginUser } = useContext(AuthContext)
    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
    const [showError, setShowError] = useState(false);
    const [providers, setproviders] = useState<any>({});

    useEffect(() => {
        getProviders().then(prov => {
            setproviders(prov)
        })
    }, [])



    const onLoginUser = async ({ email, password }: FormData) => {
        setShowError(false);
        await signIn('credentials', { email, password })
        // try {
        //     await signIn('credentials', { email, password });
        //     const isValidLogin = await loginUser(email, password)
        //     if (!isValidLogin) {
        //         setShowError(true);
        //         setTimeout(() => {
        //             setShowError(false)
        //         }, 3000);
        //         return;
        //     }

        //     const destination = router.query.page?.toString() || '/';
        //     router.replace(destination)
        // } catch (error) {
        //     console.log("Error en las credenciales");
        //     setShowError(true);
        //     setTimeout(() => {
        //         setShowError(false)
        //     }, 3000);
        // }
    }


    return (
        <AuthLayout title='Ingresar'>
            <form onSubmit={handleSubmit(onLoginUser)}>

                <Box sx={{ width: 350, padding: '10px 20px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant='h1' component='h1'>
                                Iniciar Sesión
                            </Typography>
                            <Chip
                                label="No reconocemos ese usuario / Contraseña"
                                color='error'
                                icon={<ErrorOutline />}
                                className="fadeIn"
                                sx={{ display: showError ? 'flex' : 'none' }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type="email"
                                label="Correo"
                                variant="filled"
                                fullWidth
                                {...register('email', {
                                    required: 'Este campo es requerido',
                                    validate: validations.isEmail
                                })}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Contraseña"
                                type='password'
                                variant="filled"
                                fullWidth
                                {...register('password', {
                                    required: 'Este campo es requerido',
                                    minLength: { value: 6, message: 'Mínimo 6 caracteres' }


                                })}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button type="submit" color="secondary" className="circular-btn" size="large" fullWidth>Ingresar</Button>
                        </Grid>

                        <Grid item xs={12} display='flex' justifyContent='end' >
                            <Link href={router.query.page ? `/auth/register?page=${router.query.page?.toString()}` : '/auth/register'} passHref>
                                ¿No tienes cuenta?
                            </Link>
                        </Grid>

                        <Grid item xs={12} display='flex' flexDirection='column' justifyContent='end' >
                            <Divider sx={{ width: '100%', mb: 2 }} />

                            {
                                Object.values(providers).map((provider: any) => {
                                    if (provider.id === 'credentials') return (<div key='credentials'></div>)
                                    return (

                                        <Button
                                            key={provider.id}
                                            fullWidth
                                            variant='outlined'
                                            color='primary'
                                            sx={{ mb: 1 }}
                                            onClick={() => signIn(provider.id)}
                                        >
                                            {provider.name}
                                        </Button>
                                    )

                                })
                            }


                            <Link href={router.query.page ? `/auth/register?page=${router.query.page?.toString()}` : '/auth/register'} passHref>
                                ¿No tienes cuenta?
                            </Link>
                        </Grid>
                    </Grid>

                </Box>

            </form>
        </AuthLayout>
    )
}


// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

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

export default LoginPage