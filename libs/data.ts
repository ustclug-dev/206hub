import fs from "fs"
import path from "path"
import yaml from "js-yaml"

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
    aliases: [string]
    links: [{ source: string; link: string }]
    meta: [{ name: string; value: string }]
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
  return items
}

export function getAuthors(): Map<string, { name: string; avatar: string }> {
  const authorsYamlFile = path.join(dataDirectory, "authors.yaml")
  const authors = yaml.load(fs.readFileSync(authorsYamlFile, "utf8"))
  return authors
}
