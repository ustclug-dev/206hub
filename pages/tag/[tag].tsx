import { GetStaticProps, GetStaticPaths } from "next"
import { getTags } from "../../libs/data"
import { ValueOf } from "../../libs/utils"
import Link from "next/link"

type TagParams = {
  params: {
    tag: string
  }
}

export const getStaticProps: GetStaticProps = async ({ params }: TagParams) => {
  const tagInfo = getTags()[params.tag]
  return {
    props: {
      tagInfo,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const tagSlugs = Object.keys(getTags())
  return {
    paths: tagSlugs.map((tag) => ({
      params: { tag },
    })),
    fallback: false,
  }
}

export default function TagItemPage({
  tagInfo,
}: {
  tagInfo: ValueOf<ReturnType<typeof getTags>>
}) {
  return (
    <>
      <h1>标签: {tagInfo.tagName}</h1>
      {tagInfo.items.map((item) => (
        <li key={`${item.collectionSlug}/${item.itemSlug}`}>
          <Link href={`/${item.collectionSlug}/${item.itemSlug}`}>
            <a>{item.collectionSlug}</a>
          </Link>
        </li>
      ))}
    </>
  )
}
