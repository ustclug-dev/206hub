import { GetStaticProps } from "next"
import { getTags } from "../../libs/data"
import Link from "next/link"

export const getStaticProps: GetStaticProps = async (context) => {
  const tags = getTags()
  return {
    props: {
      tags,
    },
  }
}

function TagPage({ tags }: { tags: ReturnType<typeof getTags> }) {
  console.log(tags)
  const tagElements = tags.map((tag) => (
    <li key={tag.tagSlug}>
      <Link href={`/tag/${tag.tagSlug}`}>
        <a>{tag.tagName}</a>
      </Link>
    </li>
  ))
  return (
    <>
      <h1>所有标签</h1>
      {tagElements}
    </>
  )
}

export default TagPage
