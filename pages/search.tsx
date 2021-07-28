import { GetStaticProps } from "next"
import {
  getCollections,
  getItemsInCollection,
  getAuthors,
  getCommentListOfItem,
  getComment,
} from "../libs/data"
import { useState } from 'react'

export const getStaticProps: GetStaticProps = async (context) => {
  let results = []
  const collections = getCollections()
  const authors = getAuthors()
  for (let collectionSlug in collections) {
    const items = getItemsInCollection(collectionSlug)
    for (let itemSlug in items) {
      const commentAuthors = getCommentListOfItem(collectionSlug, itemSlug)
      const comments = []
      for (let author of commentAuthors) {
        const comment = await getComment(collectionSlug, itemSlug, author, true)
        comments.push({
          commenter: authors[author].name,
          content: comment.contents,
          date: comment.metadata.date, // TODO: how to handle date correctly?
          score: comment.metadata.score,
          tags: comment.metadata.tags,
        })
      }
      results.push({
        collection: collections[collectionSlug].name,
        url: `/${collectionSlug}/${itemSlug}`, // TODO: add hashtag
        name: items[itemSlug].name,
        aliases: items[itemSlug].aliases,
        links: items[itemSlug].links,
        comments: comments,
      })
    }
  }
  return {
    props: { fullData: results },
  }
}

function search(keyword: string, obj: any) {
  // keyword is always a string
  if (typeof obj === "string") {
    return +obj.includes(keyword) // returns a Number
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

function SearchPage({ fullData }) {
  const [keywords, setKeywords] = useState([])
  let results = []
  if (keywords) {
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
    results.sort((x, y) => (x.score - y.score))
  }
  const resultItems = results.map((item) => <li key={item.data.url}>[{item.data.collection}] {item.data.name}</li>)
  return (
    <>
      <h1>搜索</h1>
      <input type='text' placeholder='输入需要搜索的关键词……' onChange={(e) => setKeywords(e.target.value.split(/[ ,]+/))}></input>
      <h3>结果</h3>
      <div>
        {resultItems}
      </div>
    </>
  )
}

export default SearchPage
