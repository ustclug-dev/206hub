import fs from "fs"
import path from "path"
import yaml from "js-yaml"
import matter from "gray-matter"
import remark from "remark"
import html from "remark-html"

const dataDirectory = path.join(process.cwd(), "data")

export function getCollections(): Map<string, { name: string }> {
  const collectionsYamlFile = path.join(dataDirectory, "collections.yaml")
  const collections = yaml.load(fs.readFileSync(collectionsYamlFile, "utf8"))
  return collections
}

export function getItemsInCollection(collection: string): Map<
  string,
  {
    name: string
    aliases: string[]
    links: { source: string; link: string }[]
    meta: { name: string; value: string }[]
  }
> {
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

export function getAuthors(): Map<string, { name: string; avatar: string }> {
  const authorsYamlFile = path.join(dataDirectory, "authors.yaml")
  const authors = yaml.load(fs.readFileSync(authorsYamlFile, "utf8"))
  return authors
}

export function getCommentListOfItem(
  collection: string,
  item: string
): string[] {
  const itemDirectory = path.join(dataDirectory, collection, item)
  const commentAuthors = fs
    .readdirSync(itemDirectory)
    .filter((authorMarkdownFilename) => authorMarkdownFilename.endsWith(".md"))
    .map((authorMarkdownFilename) => authorMarkdownFilename.slice(0, -3)) // remove ".md"
  return commentAuthors
}

export async function getComment(
  collection: string,
  item: string,
  author: string,
  raw: boolean = false
): Promise<{
  metadata: { tags: string[]; score: Number; date: string }
  contents: string
}> {
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
