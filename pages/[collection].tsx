import { GetStaticProps, GetStaticPaths } from "next"
import { getCollections, getItemSlugs, getItemPreview } from "../libs/data"
import { slugify } from "../libs/utils"

import { ItemPreview } from "../libs/type"

import Link from "next/link"

type CollectionParams = {
  params: {
    collection: string
  }
}

export const getStaticProps: GetStaticProps = async ({
  params,
}: CollectionParams) => {
  const collections = getCollections()
  const collectionSlug = params.collection
  const collectionName = collections.filter((x) => x.slug === collectionSlug)[0]
    .name // ensure that collection slug is unique!

  const itemSlugs = getItemSlugs(collectionSlug)
  const items = itemSlugs.map((itemSlug) => {
    const itemPreview = getItemPreview(collectionSlug, itemSlug)
    return itemPreview
  })
  return {
    props: {
      collectionSlug,
      collectionName,
      items,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const collections = getCollections().map((collection) => collection.slug)
  return {
    paths: collections.map((key) => {
      return {
        params: {
          collection: key,
        },
      }
    }),
    fallback: false,
  }
}

export default function Post({
  collectionSlug,
  collectionName,
  items,
}: {
  collectionSlug: string
  collectionName: string
  items: ItemPreview[]
}) {
  const itemElements = items.map((item) => (
    <li key={item.name}>
      <Link href={`/${collectionSlug}/${item.slug}`}>
        <a>{item.name}</a>
      </Link>
      , {item.commentCnt} 条点评, 平均分 {item.averageScore}, 标签{" "}
      <ul>
        {item.tags.map((tag) => (
          <li key={tag}>
            <Link href={`/tag/${slugify(tag)}`}>{tag}</Link>
          </li>
        ))}
      </ul>
    </li>
  ))
  return (
    <>
      <h3>分类：{collectionName}</h3>
      {itemElements}
    </>
  )
}
