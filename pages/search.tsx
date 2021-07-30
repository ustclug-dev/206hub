import { GetStaticProps } from "next"
import {
  getCollections,
  getItemSlugs,
  getCommentAuthorSlugs,
  getComment,
  getItemMeta,
} from "../libs/data"
import { CommentMetadata, Author } from "../libs/type"
import { useState } from "react"
import Link from "next/link"

type SearchData = {
  collection: string
  url: string
  name: string
  aliases: string[]
  links: { source: string; link: string }[]
  comments: {
    content: string
    metadata: MetaDataForSearch
  }[]
}[]

type MetaDataForSearch = {
  tags: string[]
  author: string
}

function cleanMetadata(metadata: CommentMetadata): MetaDataForSearch {
  return {
    tags: metadata.tags,
    author: metadata.author.name,
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const collections = getCollections()
  const fullData: SearchData = (
    await Promise.all(
      collections.map(async (collection) => {
        const itemSlugs = getItemSlugs(collection.slug)
        const items = (
          await Promise.all(
            itemSlugs.map(async (itemSlug) => {
              const authorSlugs = getCommentAuthorSlugs(
                collection.slug,
                itemSlug
              )
              const itemMeta = getItemMeta(collection.slug, itemSlug)
              const comments = await Promise.all(
                authorSlugs.map(async (authorSlug) => {
                  let comment: any = await getComment(
                    collection.slug,
                    itemSlug,
                    authorSlug,
                    true
                  )
                  // remove unnecessary keys
                  comment.metadata = cleanMetadata(comment.metadata)
                  return comment
                })
              )
              const itemInfo = {
                itemSlug,
                comments,
                name: itemMeta.name,
                aliases: itemMeta.aliases,
                links: itemMeta.links,
              }
              if (itemMeta.meta) {
                ;(itemInfo as any).meta = itemMeta.meta
              }
              return itemInfo
            })
          )
        ).flat()
        return items.map((item) => ({
          name: item.name,
          aliases: item.aliases,
          links: item.links,
          comments: item.comments,
          collection: collection.name,
          url: `/${collection.slug}/${item.itemSlug}`,
        }))
      })
    )
  ).flat()
  return {
    props: { fullData },
  }
}

function search(keyword: string, obj: any) {
  // keyword is always a string
  if (typeof obj === "string") {
    return +obj.includes(keyword) // returns a number
  } else if (typeof obj === "number") {
    return +obj.toString().includes(keyword)
  } else if (Array.isArray(obj)) {
    let score = 0
    for (let i = 0; i < obj.length; i++) {
      score += search(keyword, obj[i])
    }
    return score
  } else {
    // a dictionary / an object
    let score = 0
    for (let key in obj) {
      score += search(keyword, obj[key])
    }
    return score
  }
}

function SearchPage({ fullData }: { fullData: SearchData }) {
  const [keywords, setKeywords] = useState([""])
  let results = []
  if (keywords[0] !== "") {
    for (let i = 0; i < fullData.length; i++) {
      let score = 0
      for (let j = 0; j < keywords.length; j++) {
        score += search(keywords[j], fullData[i])
      }
      if (score != 0) {
        results.push({
          data: fullData[i],
          score: score,
        })
      }
    }
    results.sort((x, y) => x.score - y.score)
  }
  const resultItems = results.map((item) => (
    <li key={item.data.url}>
      [{item.data.collection}]{" "}
      <Link href={item.data.url}>
        <a>{item.data.name}</a>
      </Link>
    </li>
  ))
  return (
    <>
      <h1>搜索</h1>
      <input
        type="text"
        placeholder="输入需要搜索的关键词……"
        onChange={(e) => setKeywords(e.target.value.trim().split(/[ ,]+/))}
      ></input>
      <h3>结果</h3>
      <div>{resultItems}</div>
    </>
  )
}

export default SearchPage
