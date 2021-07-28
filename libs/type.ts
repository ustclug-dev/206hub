export type Collections = Map<string, { name: string }>
export type Item = {
  name: string
  aliases: string[]
  links: { source: string; link: string }[]
  meta?: { name: string; value: string }[]
}
export type ItemsInCollection = Map<string, Item>
export type Author = { name: string; avater: string }
export type Authors = Map<string, Author>
export type CommentsOfItem = string[]
export type CommentMetadata = { tags: string[]; score: number; date: string }
export type Comment = {
  metadata: CommentMetadata
  contents: string
}
export type CommentWithAuthor = Comment & {
  metadata: { author: Author }
}
