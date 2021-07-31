import { GetStaticProps } from "next"
import { getAppProps } from "../libs/data"
import Container from "react-bootstrap/Container"

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      ...getAppProps("500"),
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
      <h1>500</h1>
      <p>
        <strong>Internal Server Error :(</strong>
      </p>
      <p>The server cannot consume your request.</p>
    </Container>
  )
}
