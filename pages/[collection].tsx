import { GetStaticProps, GetStaticPaths } from "next"
import {
  getCollections,
  getItemsInCollection,
  getCommentListOfItem,
  getCommentMetadata,
} from "../libs/data"

import { CommentMetadata } from "../libs/type"
import { getAverageScoreByMetadata, getAllTagsByMetadata } from "../libs/utils"

type CollectionParams = {
  params: {
    collection: string
  }
}

export const getStaticProps: GetStaticProps = async ({
  params,
}: CollectionParams) => {
  const collections = getCollections()
  console.log(params.collection)
  const collectionSlug = params.collection
  const collectionName = collections[collectionSlug].name

  const itemsMap = getItemsInCollection(collectionSlug)
  const items = Object.keys(itemsMap).map((key) => {
    return {
      name: itemsMap[key].name,
      comment: getCommentListOfItem(collectionSlug, key).map((author) =>
        getCommentMetadata(collectionSlug, key, author)
      ),
    }
  })
  return {
    props: {
      collectionName,
      items,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const collections = Object.keys(getCollections())
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
  collectionName,
  items,
}: {
  collectionName: string
  items: {
    name: string
    comment: CommentMetadata[]
  }[]
}) {
  const itemElements = items.map((item) => (
    <li key={item.name}>
      {item.name}, {item.comment.length} 条点评, 平均分{" "}
      {getAverageScoreByMetadata(item.comment)}, 标签{" "}
      <ul>
        {getAllTagsByMetadata(item.comment).map((tag) => (
          <li key={tag}>{tag}</li>
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
