import fs from "fs"
import path from "path"
import yaml from "js-yaml"
import matter from "gray-matter"
import remark from "remark"
import html from "remark-html"

import { Collections, ItemsInCollection, Authors, CommentsOfItem, Comment, CommentMetadata } from './type'

const dataDirectory = path.join(process.cwd(), "data")

export function getCollections(): Collections {
  const collectionsYamlFile = path.join(dataDirectory, "collections.yaml")
  const collections = yaml.load(fs.readFileSync(collectionsYamlFile, "utf8"))
  return collections
}

export function getItemsInCollection(collection: string): ItemsInCollection {
  const collectionDirectory = path.join(dataDirectory, collection)
  const itemNames = fs.readdirSync(collectionDirectory).filter((itemName) => {
    if (itemName.startsWith(".")) {
      // no hidden file
      return false
    }
    const fileName = path.join(collectionDirectory, itemName)
    return fs.lstatSync(fileName).isDirectory()
  })
  const items = itemNames.reduce((resObject, itemName, index, array) => {
    const yamlFile = path.join(collectionDirectory, itemName, "meta.yaml")
    resObject[itemName] = yaml.load(fs.readFileSync(yamlFile, "utf8"))
    return resObject
  }, {})
  // @ts-ignore: Depends on file contents
  return items
}

export function getAuthors(): Authors {
  const authorsYamlFile = path.join(dataDirectory, "authors.yaml")
  const authors = yaml.load(fs.readFileSync(authorsYamlFile, "utf8"))
  return authors
}

export function getCommentListOfItem(
  collection: string,
  item: string
): CommentsOfItem {
  const itemDirectory = path.join(dataDirectory, collection, item)
  const commentAuthors = fs
    .readdirSync(itemDirectory)
    .filter((authorMarkdownFilename) => authorMarkdownFilename.endsWith(".md"))
    .map((authorMarkdownFilename) => authorMarkdownFilename.slice(0, -3)) // remove ".md"
  return commentAuthors
}

export function getCommentMetadata(
  collection: string,
  item: string,
  author: string,
): CommentMetadata {
  const commentFile = path.join(dataDirectory, collection, item, author + ".md")
  const matterResult = matter(fs.readFileSync(commentFile, "utf8"))
  // @ts-ignore: Depends on file contents
  return matterResult.data
}

export async function getComment(
  collection: string,
  item: string,
  author: string,
  raw: boolean = false
): Promise<Comment> {
  const commentFile = path.join(dataDirectory, collection, item, author + ".md")
  const matterResult = matter(fs.readFileSync(commentFile, "utf8"))
  const metadata = matterResult.data
  const markdownData = matterResult.content
  let contents = ""
  if (!raw) {
    const processedContent = await remark().use(html).process(markdownData)
    contents = processedContent.toString()
  } else {
    contents = markdownData
  }
  const comment = {
    metadata: metadata,
    contents: contents,
  }
  // @ts-ignore: Depends on file contents
  return comment
}
