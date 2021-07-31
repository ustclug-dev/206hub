import { GetStaticProps, GetStaticPaths } from "next"
import { getTags, getAppProps } from "../../libs/data"
import { TagList } from "../../libs/type"
import { slugify } from "../../libs/utils"
import Link from "next/link"
import Archive from "../../components/archive"

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
      ...getAppProps(),
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
  return <Archive title={`标签: ${tagInfo.tagName}`} items={tagInfo.items} />
}
