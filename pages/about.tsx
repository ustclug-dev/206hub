import { GetStaticProps } from "next"
import { getAppProps } from "../libs/data"

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      ...getAppProps(),
    },
  }
}

export default function AboutPage() {
  return <></>
}
