import "bootstrap/dist/css/bootstrap.min.css"
import "../styles/bootstrapOverride.scss"
import "../styles/206hub.scss"
import { AppProps } from "next/app"
import Head from "next/head"
import Container from "react-bootstrap/Container"
import Header from "../components/header"
import Footer from "../components/footer"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
      </Head>
      <Header collections={pageProps.app.header} />
      <Container className="flex-grow-1 my-4">
        <Component {...pageProps} />
      </Container>
      <Footer />
    </div>
  )
}
