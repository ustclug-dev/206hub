import { GetStaticProps, GetStaticPaths } from "next"
import Link from "next/link"
import {
  getCollections,
  getItemSlugs,
  getCommentAuthorSlugs,
  getItemMeta,
  getComment,
  getAppProps,
} from "../libs/data"

import { ItemMeta, Comment } from "../libs/type"
import { getAverageScoreByComments, slugify } from "../libs/utils"
// import Image from "next/image"

import Card from "react-bootstrap/Card"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Date from "../components/date"

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
      ...getAppProps(itemMeta.name),
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
  return <>
    <Card bg="light" className="shadow-sm border-info">
      <Card.Header className="bg-info text-white text-center py-3">
        <h1 className="mb-0">{itemMeta.name}</h1>
      </Card.Header>
      <Card.Body>
        <Row className="m-0 p-0">
          <Col
            sm={true}
            className="col-12 col flex-grow-1"
            style={{ flexBasis: 0 }}
          >
            <Row as="dl" className="mb-0">
              {itemMeta.aliases && (
                <Col as="dt" lg={2} className="col-12">
                  其他名称
                </Col>
              )}
              {itemMeta.aliases && (
                <Col as="dd" lg={10} className="col-12">
                  <ul className="list-unstyled">
                    {itemMeta.aliases.map((alias) => (
                      <li key={alias}>{alias}</li>
                    ))}
                  </ul>
                </Col>
              )}
              <Col as="dt" lg={2} className="col-12">
                辅助链接
              </Col>
              <Col as="dd" lg={10} className="col-12">
                <ul className="list-unstyled">
                  {itemMeta.links.map((link) => (
                    <li key={link.source}>
                      <a href={link.link}>{link.source}</a>
                    </li>
                  ))}
                </ul>
              </Col>
              {itemMeta.meta && (
                <>
                  <Col as="dt" lg={2} className="col-12">
                    其他元信息
                  </Col>
                  <Col as="dd" lg={10} className="col-12">
                    <Row as="dl">
                      {itemMeta.meta.map((meta) => (
                        <div key={meta.name}>
                          <dt className="col-auto">{meta.name}</dt>
                          <dd className="col">{meta.value}</dd>
                        </div>
                      ))}
                    </Row>
                  </Col>
                </>
              )}
            </Row>
          </Col>
          {itemMeta.image && (
            <Col md="auto" className="col-12 px-0 col">
              {
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="mw-100 d-block mx-auto"
                  src={itemMeta.image}
                  alt={`Introduction image of ${itemMeta.name}`}
                />
              }
            </Col>
          )}
        </Row>
      </Card.Body>
      <Card.Footer className="text-white bg-info text-center">
        <span className="lead mb-0">
          平均得分：<b>{averageScore}</b>
        </span>
      </Card.Footer>
    </Card>
    {comments.map((comment) => (
      <Card
        bg="light"
        className="shadow-sm mt-3"
        key={comment.metadata.author.name}
      >
        <Card.Header>
          <h3 className="mb-0" id={comment.metadata.author.slug}>
            <Link href={`/commenter/${comment.metadata.author.slug}`}>
              {comment.metadata.author.name}
            </Link>{" "}
            的评论
            {/* TODO: Add avatar */}
          </h3>
          <p className="mt-1 mb-0">
            时间: <Date dateString={comment.metadata.date} />
          </p>
        </Card.Header>
        <Card.Body>
          <div dangerouslySetInnerHTML={{ __html: comment.contents }} />
        </Card.Body>
        <Card.Footer>
          <h3 className="float-start mb-0">{comment.metadata.score} 分</h3>
          <div className="float-end">
            {comment.metadata.tags.map((tag) => (
              <Link
                key={slugify(tag)}
                href={`/tag/${slugify(tag)}`}
                passHref
                className="tagButton">
                {tag}
              </Link>
            ))}
          </div>
        </Card.Footer>
      </Card>
    ))}
  </>;
}
