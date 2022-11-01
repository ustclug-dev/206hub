import { GetStaticProps } from "next"
import { getTags, getAppProps } from "../../libs/data"
import Link from "next/link"
import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button"

import styles from "./index.module.css"

export const getStaticProps: GetStaticProps = async (context) => {
  const tags = getTags()
  return {
    props: {
      tags,
      ...getAppProps("所有标签"),
    },
  }
}

function TagPage({ tags }: { tags: ReturnType<typeof getTags> }) {
  const tagElements = tags.map((tag) => (
    <Link
      href={`/tag/${tag.tagSlug}`}
      key={tag.tagSlug}
      passHref
      className="tagButton"
    >
      {tag.tagName}
    </Link>
  ))
  return (
    <Card bg="light" className="shadow-sm">
      <Card.Header className="py-3">
        <h3 className="mb-0">所有标签</h3>
      </Card.Header>
      <Card.Body className={styles.tagCardBody}>{tagElements}</Card.Body>
    </Card>
  )
}

export default TagPage
