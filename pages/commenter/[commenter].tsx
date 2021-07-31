import { GetStaticProps, GetStaticPaths } from "next"
import { getAuthors, getAuthorData, getAppProps } from "../../libs/data"
import { Author } from "../../libs/type"
import { Awaited } from "../../libs/utils"
import Link from "next/link"

type CommenterParams = {
  params: {
    commenter: string
  }
}

export const getStaticProps: GetStaticProps = async ({
  params,
}: CommenterParams) => {
  const authorData = await getAuthorData(params.commenter)
  const authorInstance = getAuthors().filter(
    (author) => author.slug === params.commenter
  )[0]
  return {
    props: {
      authorData,
      authorInstance,
      ...getAppProps(),
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const authors = getAuthors()
  const paths = authors.map((author) => ({
    params: { commenter: author.slug },
  }))
  return {
    paths,
    fallback: false,
  }
}

export default function CommenterPage({
  authorData,
  authorInstance,
}: {
  authorData: Awaited<ReturnType<typeof getAuthorData>>
  authorInstance: Author
}) {
  return (
    <>
      <h1>评论者: {authorInstance.name}</h1>
      <a
        type="button"
        href={`data:text/json;charset=utf-8,${encodeURIComponent(
          JSON.stringify(authorData)
        )}`}
        download={`${authorInstance.slug}.json`}
      >
        下载用户数据 (JSON)
      </a>
      {authorData.map((comment) => {
        const url = `/${comment.info.collection.slug}/${comment.info.item.slug}#${authorInstance.slug}`
        return (
          <li key={url}>
            [{comment.info.collection.name}]{" "}
            <Link href={url}>
              <a>{comment.info.item.name}</a>
            </Link>
            : <code>{JSON.stringify(comment.comment)}</code>
          </li>
        )
      })}
    </>
  )
}
