import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import { CssBaseline, ThemeProvider } from '@mui/material'
import { SWRConfig } from 'swr'
import { lightTheme } from '../themes'
import { UIProvider, CartProvider, AuthProvider } from '../context'
import '../styles/globals.css'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'

export default function App({ Component, pageProps }: AppProps) {

  if (!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID) {
    throw new Error("Se necesita el ClientID de Paypal");

  }
  return (
    <SessionProvider >
      <PayPalScriptProvider options={{ "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '' }}>

        <SWRConfig value={{
          fetcher: (...args: [key: string]) =>
            fetch(...args).then((res) => res.json())
        }

        }>
          <AuthProvider>
            <CartProvider>
              <UIProvider>
                <ThemeProvider theme={lightTheme}>
                  <CssBaseline>
                    <Component {...pageProps} />
                  </CssBaseline>
                </ThemeProvider >
              </UIProvider>
            </CartProvider>
          </AuthProvider>
        </SWRConfig >
      </PayPalScriptProvider>
    </SessionProvider >


  )
}
