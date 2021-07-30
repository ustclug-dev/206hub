import { GetStaticProps, GetStaticPaths } from "next"
import {
  getCollections,
  getItemsInCollection,
  getCommentListOfItem,
  getCommentMetadata,
} from "../libs/data"

import { CommentMetadata } from "../libs/type"
import { getAverageScoreByMetadata, getAllTagsByMetadata } from "../libs/utils"

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
  const collectionName = collections[collectionSlug].name

  const itemsRecord = getItemsInCollection(collectionSlug)
  const items = Object.keys(itemsRecord).map((key) => {
    return {
      slug: key,
      name: itemsRecord[key].name,
      comment: getCommentListOfItem(collectionSlug, key).map((author) =>
        getCommentMetadata(collectionSlug, key, author)
      ),
    }
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
  collectionSlug,
  collectionName,
  items,
}: {
  collectionSlug: string
  collectionName: string
  items: {
    slug: string
    name: string
    comment: CommentMetadata[]
  }[]
}) {
  const itemElements = items.map((item) => (
    <li key={item.name}>
      <Link href={`/${collectionSlug}/${item.slug}`}>
        <a>{item.name}</a>
      </Link>
      , {item.comment.length} 条点评, 平均分{" "}
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
