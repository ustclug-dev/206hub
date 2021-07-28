import { GetStaticProps, GetStaticPaths } from "next"
import {
  getCollections,
  getItemsInCollection,
  getCommentListOfItem,
  getAuthors,
  getComment,
} from "../libs/data"

import { CommentWithAuthor, Item as ItemType } from "../libs/type"
import { getAverageScoreByComments } from '../libs/utils'

export const getStaticProps: GetStaticProps = async ({
  params,
}: {
  params: {
    item: string[]
  }
}) => {
  const path = params.item
  const [collection, item] = path
  const itemData: ItemType = getItemsInCollection(collection)[item]
  const commentAuthors = getCommentListOfItem(collection, item)
  const authors = getAuthors()
  const comments = await Promise.all(
    commentAuthors.map(async (author) => {
      let comment = (await getComment(
        collection,
        item,
        author
      )) as CommentWithAuthor
      comment.metadata.author = authors[author]
      return comment
    })
  )
  return {
    props: {
      item: itemData,
      comments,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const collections = Object.keys(getCollections())
  const itemsList = collections.map((collection) => {
    return {
      collection,
      items: Object.keys(getItemsInCollection(collection)),
    }
  })
  let paths = []
  for (let collection of itemsList) {
    for (let item of collection.items) {
      paths.push({
        params: { item: [collection.collection, item] },
      })
    }
  }
  return {
    paths,
    fallback: false,
  }
}


export default function Item({
  item,
  comments,
}: {
  item: ItemType
  comments: CommentWithAuthor[]
}) {
  return (
    <>
      <h1>{item.name}</h1>
      <h3>其他名称</h3>
      <ul>
        {item.aliases.map((alias) => (
          <li key={alias}>{alias}</li>
        ))}
      </ul>
      <h3>辅助链接</h3>
      <ul>
        {item.links.map((link) => (
          <li key={link.source}>
            <a href={link.link}>{link.source}</a>
          </li>
        ))}
      </ul>
      {item.meta && (
        <>
          <h3>其他元信息</h3>
          <ul>
            {item.meta.map((meta) => (
              <li key={meta.name}>
                {meta.name}: {meta.value}
              </li>
            ))}
          </ul>
        </>
      )}
      <hr />
      <h4>平均得分：{getAverageScoreByComments(comments)}</h4>
      {comments.map((comment) => (
        <div key={comment.metadata.author.name}>
          <h3>{comment.metadata.author.name} 的评论</h3>{" "}
          {/* TODO: Add avatar */}
          <span>时间: {comment.metadata.date}</span>
          <br />
          <span>标签: {comment.metadata.tags}</span>
          <br />
          <span>分数: {comment.metadata.score}</span>
          <br />
          <div dangerouslySetInnerHTML={{ __html: comment.contents }} />
        </div>
      ))}
    </>
  )
}
