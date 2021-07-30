import site from "../config/site"
import { getAllComments } from "./data"
import fs from "fs"
import path from "path"
import { Feed } from "feed"

export const generateRSS = async () => {
  const comments = await getAllComments()

  const feed = new Feed({
    title: site.title,
    description: site.description,
    id: site.url,
    link: site.url,
    language: "zh-CN",
    copyright: "Copyrights of comments belong to their creators.",
  })

  comments.forEach((comment) => {
    const url =
      site.url +
      `/${comment.info.collection.slug}/${comment.info.item.slug}#${comment.comment.metadata.author.slug}`
    feed.addItem({
      title: `${comment.comment.metadata.author.name} 评论了 ${comment.info.item.name}`,
      id: url,
      link: url,
      date: new Date(comment.comment.metadata.date),
      author: [
        {
          name: comment.comment.metadata.author.name,
          link: `/commenter/${comment.comment.metadata.author.slug}`,
        },
      ],
      content: comment.comment.contents,
    })
  })

  fs.writeFileSync(path.join(process.cwd(), "public", "atom.xml"), feed.atom1())
}

export default generateRSS
