import fs from "fs"
import path from "path"
import yaml from "js-yaml"
import matter from "gray-matter"
import remark from "remark"
import html from "remark-html"
import gfm from "remark-gfm"
import styleGuide from "remark-preset-lint-markdown-style-guide"

import {
  Collection,
  Collections,
  ItemPreview,
  Item,
  ItemMeta,
  Author,
  Authors,
  Comment,
  CommentMetadata,
  ItemPath,
  TagList,
} from "./type"
import {
  getAllTagsByMetadata,
  union,
  slugify,
  getAverageScoreByMetadata,
} from "./utils"

const dataDirectory = path.join(process.cwd(), "data")

function getRawCollections() {
  const collectionsYamlFile = path.join(dataDirectory, "collections.yaml")
  const collections: Record<
    string,
    {
      name: string
    }
  > = yaml.load(fs.readFileSync(collectionsYamlFile, "utf8"))
  return collections
}

export function getCollections(): Collections {
  const collections = getRawCollections()
  return Object.keys(collections).map((slug) => ({
    name: collections[slug].name,
    slug,
  }))
}

export function getCollectionFromSlug(collectionSlug: string) {
  const collection = getRawCollections()[collectionSlug]
  return {
    name: collection.name,
    slug: collectionSlug,
  }
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

export function getItemPreview(collection: string, item: string): ItemPreview {
  const meta = getItemMeta(collection, item)
  const commentAuthorSlugs = getCommentAuthorSlugs(collection, item)
  const commentMetadatas = commentAuthorSlugs.map((authorSlug) =>
    getCommentMetadata(collection, item, authorSlug)
  )
  const tags = getAllTagsByMetadata(commentMetadatas)
  const averageScore = getAverageScoreByMetadata(commentMetadatas)
  return {
    name: meta.name,
    slug: item,
    commentCnt: commentMetadatas.length,
    averageScore: averageScore,
    tags: tags,
    collection: getCollectionFromSlug(collection),
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
  const matterResult = matter(fs.readFileSync(commentFile, "utf8"), {
    engines: {
      yaml: (s) => yaml.safeLoad(s, { schema: yaml.JSON_SCHEMA }),
    },
  })
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
    const processedContent = await remark()
      .use(styleGuide)
      .use(gfm)
      .use(html)
      .process(markdownData)
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

export function getTags(): TagList {
  // iterate all comments and get their tags
  const items = getCollections()
    .map((collection) => {
      const itemSlugs = getItemSlugs(collection.slug)
      const itemTags = itemSlugs.map((itemSlug) => {
        const tags = getItemTags(collection.slug, itemSlug).map((tagName) => ({
          tagName,
          tagSlug: slugify(tagName),
        }))
        return {
          tags,
          item: {
            collection: collection,
            item: {
              slug: itemSlug,
              name: getItemMeta(collection.slug, itemSlug).name,
            },
          },
        }
      })
      return itemTags
    })
    .flat()
  let result = {}
  let dedupSetMap: Map<string, Set<ItemPath>> = new Map()
  for (let i of items) {
    const item = i.item
    for (let tag of i.tags) {
      if (!dedupSetMap.has(tag.tagSlug)) {
        result[tag.tagSlug] = {
          tagName: tag.tagName,
          tagSlug: tag.tagSlug,
          items: [],
        }
        dedupSetMap.set(tag.tagSlug, new Set())
      }
      if (!dedupSetMap.get(tag.tagSlug).has(item)) {
        result[tag.tagSlug].items.push(
          getItemPreview(item.collection.slug, item.item.slug)
        )
        dedupSetMap.get(tag.tagSlug).add(item)
      }
    }
  }
  return Object.values(result)
}

export async function getAuthorData(author: string): Promise<
  {
    info: ItemPath
    comment: Comment
  }[]
> {
  const collections = getCollections()
  const items = collections
    .map((collection) => {
      const itemSlugs = getItemSlugs(collection.slug)
      return itemSlugs.map((itemSlug) => ({
        collection: collection.slug,
        item: itemSlug,
      }))
    })
    .flat()
  const itemWithAuthorCommented = items
    .map((itemPath) => {
      const authors = getCommentAuthorSlugs(
        itemPath.collection,
        itemPath.item
      ).filter((_) => author === _)
      if (authors.length === 0) {
        return
      } else {
        return itemPath
      }
    })
    .filter((x) => x !== undefined)
  const comments = Promise.all(
    itemWithAuthorCommented.map(async (itemPath) => {
      const comment = await getComment(
        itemPath.collection,
        itemPath.item,
        author
      )
      return {
        info: {
          collection: getCollectionFromSlug(itemPath.collection),
          item: {
            name: getItemMeta(itemPath.collection, itemPath.item).name,
            slug: itemPath.item,
          },
        },
        comment,
      }
    })
  )
  return comments
}

export async function getAllComments(): Promise<
  {
    comment: Comment
    info: ItemPath
  }[]
> {
  const items = getCollections()
    .map((collection) => {
      const itemSlugs = getItemSlugs(collection.slug)
      return itemSlugs.map((itemSlug) => {
        return {
          collection: collection,
          item: {
            name: getItemMeta(collection.slug, itemSlug).name,
            slug: itemSlug,
          },
        }
      })
    })
    .flat()
  const comments = (
    await Promise.all(
      items.map(async (item) => {
        const authors = getCommentAuthorSlugs(
          item.collection.slug,
          item.item.slug
        )
        const comments = await Promise.all(
          authors.map(async (author) => {
            const comment = await getComment(
              item.collection.slug,
              item.item.slug,
              author
            )
            return {
              comment,
              info: {
                collection: item.collection,
                item: item.item,
              },
            }
          })
        )
        return comments
      })
    )
  ).flat()
  return comments
}

export function getAppProps(title?: string) {
  title = title || null
  return {
    app: {
      title,
      header: getCollections(),
    },
  }
}
