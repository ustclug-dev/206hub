import { GetStaticProps, GetStaticPaths } from "next"

export const getStaticProps: GetStaticProps = async ({ params }) => {}

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

export default function TagItemPage() {
  return (
    <>
    </>
  )
}
