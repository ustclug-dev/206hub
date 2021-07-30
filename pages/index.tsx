import { GetStaticProps } from "next"
import {
  getCollections,
  getItemsInCollection,
  getCommentListOfItem,
} from "../libs/data"
import Link from "next/link"

export const getStaticProps: GetStaticProps = async (context) => {
  const collections = getCollections().map(collection => ({
    slug: collection.slug,
    name: collection.name,
  }))
  let collectionProps = []
  for (let collectionSlug in collections) {
    const items = Object.keys(getItemsInCollection(collectionSlug))
    const commentsLen = items.reduce(
      (a, b) => a + getCommentListOfItem(collectionSlug, b).length,
      0
    )
    collectionProps.push({
      slug: collectionSlug,
      name: collections[collectionSlug].name,
      itemLength: items.length,
      commentsLen: commentsLen,
    })
  }
  return {
    props: {
      collections: collectionProps,
    },
  }
}

function HomePage({
  collections,
}: {
  collections: {
    slug: string
    name: string
    itemLength: number
    commentsLen: number
  }[]
}) {
  const collectionItems = collections.map((collection) => (
    <li key={collection.name}>
      <Link href={`/${collection.slug}`}>
        <a>{collection.name}</a>
      </Link>
      , {collection.itemLength} 个条目, 合计 {collection.commentsLen} 条评论
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
