import fs from "fs"
import path from "path"
import yaml from "js-yaml"
import matter from "gray-matter"
import remark from "remark"
import html from "remark-html"

import {
  Collections,
  ItemPreview,
  ItemList,
  ItemMeta,
  ItemMetaList,
  Author,
  Authors,
  Comment,
  CommentMetadata,
  ItemPath,
  tagList,
} from "./type"
import { getAllTagsByMetadata, union, slugify, getAverageScoreByMetadata } from "./utils"

const dataDirectory = path.join(process.cwd(), "data")

export function getCollections(): Collections {
  const collectionsYamlFile = path.join(dataDirectory, "collections.yaml")
  const collections: Record<
    string,
    {
      name: string
    }
  > = yaml.load(fs.readFileSync(collectionsYamlFile, "utf8"))
  return Object.keys(collections).map((slug) => ({
    name: collections[slug].name,
    slug,
  }))
}

const getCollectionDirectory = (collection: string) =>
  path.join(dataDirectory, collection)

export function getItemSlugs(collection: string): string[] {
  const collectionDirectory = getCollectionDirectory(collection)
  return fs.readdirSync(collectionDirectory).filter((itemSlug) => {
    if (itemSlug.startsWith(".")) {
      // no hidden file
      return false
    }
    const fileName = path.join(collectionDirectory, itemSlug)
    return fs.lstatSync(fileName).isDirectory()
  })
}

export function getItemMeta(collection: string, item: string): ItemMeta {
  const yamlFile = path.join(
    getCollectionDirectory(collection),
    item,
    "meta.yaml"
  )
  const itemMeta: ItemMeta = yaml.load(fs.readFileSync(yamlFile, "utf8"))
  return itemMeta
}

export function getItemMetaInCollection(collection: string): ItemMetaList {
  const itemSlugs = getItemSlugs(collection)
  const items = itemSlugs.map((itemSlug) => {
    const itemMeta = getItemMeta(collection, itemSlug)
    return {
      slug: itemSlug,
      ...itemMeta,
    }
  })
  return items
}

export function getItemPreview(collection: string, item: string): ItemPreview {
  const meta = getItemMeta(collection, item)
  const commentAuthorSlugs = getCommentAuthorSlugs(collection, item)
  const commentMetadatas = commentAuthorSlugs.map(authorSlug => getCommentMetadata(collection, item, authorSlug))
  const tags = getAllTagsByMetadata(commentMetadatas)
  const averageScore = getAverageScoreByMetadata(commentMetadatas)
  return {
    name: meta.name,
    slug: item,
    commentCnt: commentMetadatas.length,
    averageScore: averageScore,
    tags: tags,
    collectionSlug: collection
  }
}

function getRawAuthors() {
  const authorsYamlFile = path.join(dataDirectory, "authors.yaml")
  const authors: Record<string, { name: string; avatar: string }> = yaml.load(
    fs.readFileSync(authorsYamlFile, "utf8")
  )
  return authors
}

export function getAuthors(): Authors {
  const authors = getRawAuthors()
  return Object.keys(authors).map((slug) => ({
    slug,
    ...authors[slug],
  }))
}

export function getAuthorBySlug(authorSlug: string): Author {
  return {
    slug: authorSlug,
    ...getRawAuthors()[authorSlug],
  }
}

export function getCommentAuthorSlugs(
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

function getRawComment(
  collection: string,
  item: string,
  author: string
): { content: any; data: any } {
  const commentFile = path.join(dataDirectory, collection, item, author + ".md")
  const matterResult = matter(fs.readFileSync(commentFile, "utf8"))
  return {
    content: matterResult.content,
    data: {
      ...matterResult.data,
      author: getAuthorBySlug(author),
    },
  }
}

export function getCommentMetadata(
  collection: string,
  item: string,
  author: string
): CommentMetadata {
  return getRawComment(collection, item, author).data
}

export async function getComment(
  collection: string,
  item: string,
  author: string,
  raw: boolean = false
): Promise<Comment> {
  const matterResult = getRawComment(collection, item, author)
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
  return comment
}

export function getItemTags(collection: string, item: string) {
  return getAllTagsByMetadata(
    getCommentAuthorSlugs(collection, item).map((author) =>
      getCommentMetadata(collection, item, author)
    )
  )
}

export function getTags(): tagList {
  // iterate all comments and get their tags
  const items = getCollections().map((collection) => {
    const itemSlugs = getItemSlugs(collection.slug)
    const itemTags = itemSlugs.map(itemSlug => {
      const tags = getItemTags(collection.slug, itemSlug).map(tagName => ({
        tagName,
        tagSlug: slugify(tagName)
      }))
      return {
        tags,
        item: {
          collection: collection.slug,
          item: itemSlug
        }
      }
    })
    return itemTags
  }).flat()
  let result: tagList = []
  let dedupSetMap: Map<string, Set<ItemPath>> = new Map()
  for (let i of items) {
    const item = i.item
    for (let tag of i.tags) {
      if (!dedupSetMap.has[tag.tagSlug]) {
        result[tag.tagSlug] = {
          tagName: tag.tagName,
          tagSlug: tag.tagSlug,
          items: []
        }
        dedupSetMap.set(tag.tagSlug, new Set())
      }
      if (!dedupSetMap[tag.tagSlug].has(item)) {
        result[tag.tagSlug].items.push(
          getItemPreview(item.collection, item.item)
        )
        dedupSetMap[tag.tagSlug].set(item)
      }
    }
  }
  return result
}
