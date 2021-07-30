import { GetStaticProps } from "next"
import {
  getCollections,
  getItemSlugs,
  getItemPreview,
} from "../libs/data"
import generateRSS from "../libs/rss"
import Link from "next/link"

type collectionsIndex = {
  slug: string
  name: string
  itemCnt: number
  commentCnt: number
}[]

export const getStaticProps: GetStaticProps = async (context) => {
  await generateRSS()
  const collections = getCollections().map((collection) => ({
    slug: collection.slug,
    name: collection.name,
  }))
  const collectionProps: collectionsIndex = collections.map(collection => {
    const itemSlugs = getItemSlugs(collection.slug)
    const commentCnt = itemSlugs.map(itemSlug => getItemPreview(collection.slug, itemSlug).commentCnt).reduce((sum, a) => sum += a, 0)
    return {
      ...collection,
      itemCnt: itemSlugs.length,
      commentCnt
    }
  })
  
  return {
    props: {
      collections: collectionProps,
    },
  }
}

function HomePage({
  collections,
}: {
  collections: collectionsIndex
}) {
  const collectionItems = collections.map((collection) => (
    <li key={collection.name}>
      <Link href={`/${collection.slug}`}>
        <a>{collection.name}</a>
      </Link>
      , {collection.itemCnt} 个条目, 合计 {collection.commentCnt} 条评论
    </li>
  ))
  return (
    <>
      <h1>所有分类</h1>
      {collectionItems}
    </>
  )
}

export default HomePage
