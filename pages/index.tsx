import { GetStaticProps } from 'next'
import { getAuthors } from '../libs/data'

export const getStaticProps: GetStaticProps = async (context) => {
  getAuthors()
  return {
    props: {},
  }
}

function HomePage() {
  return <div>Welcome to Next.js!</div>
}

export default HomePage
