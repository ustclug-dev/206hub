import { GetStaticProps, GetStaticPaths } from "next"
import {
  getCollections,
  getItemSlugs,
  getItemPreview,
  getAppProps,
} from "../libs/data"

import { ItemPreview } from "../libs/type"

import Archive from "../components/archive"

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
      collectionName,
      items,
      ...getAppProps(collectionName),
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
  collectionName,
  items,
}: {
  collectionName: string
  items: ItemPreview[]
}) {
  return <Archive title={`分类: ${collectionName}`} items={items} />
}
