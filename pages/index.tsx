import { GetStaticProps } from "next"
import {
  getCollections,
  getItemsInCollection,
  getCommentListOfItem,
} from "../libs/data"

export const getStaticProps: GetStaticProps = async (context) => {
  const collections = getCollections()
  let collectionProps = []
  for (let collectionSlug in collections) {
    const items = Object.keys(getItemsInCollection(collectionSlug))
    const commentsLen = items.reduce(
      (a, b) => a + getCommentListOfItem(collectionSlug, b).length,
      0
    )
    collectionProps.push({
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
  collections: { name: string; itemLength: number; commentsLen: number }[]
}) {
  const collectionItems = collections.map((collection) => (
    <li key={collection.name}>
      {collection.name}, {collection.itemLength} 个条目, 合计{" "}
      {collection.commentsLen} 条评论
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
