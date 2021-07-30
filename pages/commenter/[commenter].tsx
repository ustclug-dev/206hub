import { GetStaticProps, GetStaticPaths } from "next"

export const getStaticProps: GetStaticProps = async ({ params }) => {
  return {
    props: {}
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [{
      params: {
        tag: "a",
      },
    }],
    fallback: false,
  }
}

export default function CommenterPage() {
  return (
    <>
    </>
  )
}
