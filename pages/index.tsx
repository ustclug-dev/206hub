import { GetStaticProps } from "next"
import {
  getCollections,
  getItemSlugs,
  getItemPreview,
  getAppProps,
} from "../libs/data"
import generateRSS from "../libs/rss"
import Link from "next/link"
import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"

type collectionsIndex = {
  slug: string
  name: string
  itemCnt: number
  commentCnt: number
}[]

export const getStaticProps: GetStaticProps = async (context) => {
  await generateRSS()
  const collections = getCollections().map((collection) => ({
    slug: collection.slug,
    name: collection.name,
  }))
  const collectionProps: collectionsIndex = collections.map((collection) => {
    const itemSlugs = getItemSlugs(collection.slug)
    const commentCnt = itemSlugs
      .map((itemSlug) => getItemPreview(collection.slug, itemSlug).commentCnt)
      .reduce((sum, a) => (sum += a), 0)
    return {
      ...collection,
      itemCnt: itemSlugs.length,
      commentCnt,
    }
  })

  return {
    props: {
      collections: collectionProps,
      ...getAppProps("主页"),
    },
  }
}

function HomePage({ collections }: { collections: collectionsIndex }) {
  const collectionItems = collections.map((collection) => (
    <Col
      key={collection.name}
      className="col-12 px-3 mb-4"
      sm={6}
      md={4}
      lg={3}
    >
      <Card className="shadow">
        <Card.Header>
          <h4 className="my-0 font-weight-normal">{collection.name}</h4>
        </Card.Header>
        <Card.Body>
          <Card.Title>{collection.itemCnt} 个条目</Card.Title>
          <ul className="list-unstyled mt-3 mb-4">
            <li>合计 {collection.commentCnt} 条评论</li>
          </ul>
          <Link href={`/${collection.slug}`} passHref legacyBehavior>
            <Button size="lg" className="btn-block">
              查看
            </Button>
          </Link>
        </Card.Body>
      </Card>
    </Col>
  ))
  return (
    <>
      <div className="p-3 pt-md-5 pb-md-4 mx-auto text-center">
        <h1 className="display-4">所有分类</h1>
      </div>
      <Row className="text-center">{collectionItems}</Row>
    </>
  )
}

export default HomePage
