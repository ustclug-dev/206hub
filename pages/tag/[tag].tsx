import { GetStaticProps, GetStaticPaths } from "next"
import { getTags } from "../../libs/data"
import { TagList } from "../../libs/type"
import { slugify } from "../../libs/utils"
import Link from "next/link"

type TagParams = {
  params: {
    tag: string
  }
}

export const getStaticProps: GetStaticProps = async ({ params }: TagParams) => {
  const tagInfo = getTags().filter((tag) => tag.tagSlug === params.tag)[0]
  return {
    props: {
      tagInfo,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const tagSlugs = getTags()
  return {
    paths: tagSlugs.map((tag) => ({
      params: { tag: tag.tagSlug },
    })),
    fallback: false,
  }
}

export default function TagItemPage({ tagInfo }: { tagInfo: TagList[0] }) {
  return (
    <>
      <h1>标签: {tagInfo.tagName}</h1>
      {tagInfo.items.map((item) => (
        <li key={`${item.collection.slug}/${item.slug}`}>
          [{item.collection.name}] {""}
          <Link href={`/${item.collection.slug}/${item.slug}`}>
            <a>{item.name}</a>
          </Link>
          , {item.commentCnt} 条点评, 平均分 {item.averageScore}, 标签 {""}
          <ul>
            {item.tags.map((tag) => (
              <li key={tag}>
                <Link href={`/tag/${slugify(tag)}`}>{tag}</Link>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </>
  )
}
