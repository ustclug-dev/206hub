import { GetStaticProps } from 'next'
import { getComment } from '../libs/data'

export const getStaticProps: GetStaticProps = async (context) => {
  getComment("anime", "k_on", "testA")
  return {
    props: {},
  }
}

function HomePage() {
  return <div>Welcome to Next.js!</div>
}

export default HomePage
