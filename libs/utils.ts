import { CommentMetadata, Comment } from "./type"

export function getAverageScoreByMetadata(
  metadatas: CommentMetadata[]
): number {
  return (
    metadatas.reduce((sum, metadata) => (sum += metadata.score), 0) /
    metadatas.length
  )
}

export function getAverageScoreByComments(comments: Comment[]): number {
  return getAverageScoreByMetadata(comments.map((comment) => comment.metadata))
}

// @ts-ignore: Concat arrays and remove duplicate.
export const union = (arr, ...args) => [...new Set(arr.concat(...args))]

export function getAllTagsByMetadata(metadatas: CommentMetadata[]): string[] {
  return union(metadatas.map((metadata) => metadata.tags).flat())
}

export function slugify(str: string): string {
  return str.trim().toLowerCase().replace(/\s+/g, "-").replace("/", "-")
}

export type ValueOf<T> = T[keyof T]
export type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T
