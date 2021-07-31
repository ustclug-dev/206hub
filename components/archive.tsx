import { ItemList } from "../libs/type"
import Card from "react-bootstrap/Card"
import Table from "react-bootstrap/Table"
import Link from "next/link"
import { slugify } from "../libs/utils"
import Button from "react-bootstrap/Button"

export interface ArchiveProps {
  title: string
  items: ItemList
}

export default function Archive(props: ArchiveProps) {
  return (
    <Card bg="light" className="shadow-sm">
      <Card.Header className="py-3">
        <h3 className="mb-0">{props.title}</h3>
      </Card.Header>
      <Card.Body className="p-0">
        <Table hover className="mb-0">
          <thead className="nowrap">
            <tr>
              <th>条目</th>
              <th>评论数</th>
              <th>平均分</th>
              <th>标签</th>
            </tr>
          </thead>
          <tbody>
            {props.items.map((item) => {
              const url = `/${item.collection.slug}/${item.slug}`
              return (
                <tr key={url}>
                  <td>
                    <Link href={url}>
                      <a>{item.name}</a>
                    </Link>
                  </td>
                  <td>{item.commentCnt}</td>
                  <td>{item.averageScore}</td>
                  <td>
                    {item.tags.map((tag) => (
                      <Link key={tag} href={`/tag/${slugify(tag)}`} passHref>
                        <a className="tagButton">{tag}</a>
                      </Link>
                    ))}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  )
}
