export type Collection = {
  name: string
  slug: string
}
export type Collections = Collection[]
export type ItemPreview = {
  name: string
  slug: string
  commentCnt: number
  averageScore: number
  tags: string[]
  collectionSlug: string
}
export type ItemList = ItemPreview[]
export type ItemMeta = {
  name: string
  slug: string
  aliases: string[]
  links: { source: string; link: string }[]
  meta?: { name: string; value: string }[]
}
export type ItemMetaList = ItemMeta[]
export type Author = {
  name: string
  slug: string
  avatar: string
}
export type Authors = Author[]

export type CommentMetadata = {
  tags: string[]
  score: number
  date: string
  author: Author
}
export type Comment = {
  metadata: CommentMetadata
  contents: string
}

export type ItemPath = {
  collection: string
  item: string
}

export type tagList = {
  tagName: string,
  tagSlug: string,
  items: ItemList
}[]
