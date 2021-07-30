import { GetStaticProps } from "next"
import { getTags } from "../../libs/data"
import Link from 'next/link'

export const getStaticProps: GetStaticProps = async (context) => {
  const tags = getTags()
  return {
    props: {
      tags,
    },
  }
}

function TagPage({ tags }: { tags: ReturnType<typeof getTags> }) {
  let tagElements = []
  for (let tag in tags) {
    tagElements.push(<li key={tag}>
      <Link href={`/tag/${tag}`}>
        <a>{tags[tag].tagName}</a>
      </Link>
    </li>)
  }
  return <>{tagElements}</>
}

export default TagPage
