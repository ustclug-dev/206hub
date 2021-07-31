import { GetStaticProps } from "next"
import { getAppProps } from "../libs/data"
import Container from "react-bootstrap/Container"

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      ...getAppProps("404"),
    },
  }
}

export default function AboutPage() {
  return (
    <Container>
      <style type="jsx">
        {`
  h1 {
    margin: 30px 0;
    font-size: 4em;
    line-height: 1;
    letter-spacing: -1px;
  }
  `}
      </style>
      <h1>404</h1>
      <p>
        <strong>Page not found :(</strong>
      </p>
      <p>The requested page could not be found.</p>
    </Container>
  )
}
