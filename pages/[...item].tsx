import { GetStaticProps, GetStaticPaths } from "next"
import Link from "next/link"
import {
  getCollections,
  getItemSlugs,
  getCommentAuthorSlugs,
  getItemMeta,
  getComment,
} from "../libs/data"

import { ItemMeta, Comment } from "../libs/type"
import { getAverageScoreByComments, slugify } from "../libs/utils"

export const getStaticProps: GetStaticProps = async ({
  params,
}: {
  params: {
    item: string[]
  }
}) => {
  const path = params.item
  const [collection, item] = path
  const itemMeta = getItemMeta(collection, item)
  const commentAuthors = getCommentAuthorSlugs(collection, item)
  const comments = await Promise.all(
    commentAuthors.map(async (author) => {
      return await getComment(collection, item, author)
    })
  )
  return {
    props: {
      itemMeta,
      comments,
      averageScore: getAverageScoreByComments(comments),
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const collections = getCollections().map((collection) => collection.slug)
  const paths = collections
    .map((collection) => {
      const items = getItemSlugs(collection)
      return items.map((item) => ({
        params: { item: [collection, item] },
      }))
    })
    .flat()
  return {
    paths,
    fallback: false,
  }
}

export default function Item({
  itemMeta,
  comments,
  averageScore,
}: {
  itemMeta: ItemMeta
  comments: Comment[]
  averageScore: number
}) {
  return (
    <>
      <h1>{itemMeta.name}</h1>
      <h3>其他名称</h3>
      <ul>
        {itemMeta.aliases.map((alias) => (
          <li key={alias}>{alias}</li>
        ))}
      </ul>
      <h3>辅助链接</h3>
      <ul>
        {itemMeta.links.map((link) => (
          <li key={link.source}>
            <a href={link.link}>{link.source}</a>
          </li>
        ))}
      </ul>
      {itemMeta.meta && (
        <>
          <h3>其他元信息</h3>
          <ul>
            {itemMeta.meta.map((meta) => (
              <li key={meta.name}>
                {meta.name}: {meta.value}
              </li>
            ))}
          </ul>
        </>
      )}
      <hr />
      <h4>平均得分：{averageScore}</h4>
      {comments.map((comment) => (
        <div key={comment.metadata.author.name}>
          <h3 id={comment.metadata.author.slug}>
            <Link href={`/commenter/${comment.metadata.author.slug}`}>
              <a>{comment.metadata.author.name}</a>
            </Link>{" "}
            的评论
          </h3>{" "}
          {/* TODO: Add avatar */}
          <span>时间: {comment.metadata.date}</span>
          <br />
          <span>
            标签:{" "}
            {comment.metadata.tags.map((tag) => (
              <li key={slugify(tag)}>
                <Link href={`/tag/${slugify(tag)}`}>{tag}</Link>
              </li>
            ))}
          </span>
          <br />
          <span>分数: {comment.metadata.score}</span>
          <br />
          <div dangerouslySetInnerHTML={{ __html: comment.contents }} />
        </div>
      ))}
    </>
  )
}
