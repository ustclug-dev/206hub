#!/usr/bin/env python3

# migrate 206hub from v1 to v2 alpha
# `pip install python-frontmatter pyyaml` first
# collections.yaml needs manually created, and the script will not delete old files.

from pathlib import Path
import frontmatter
import os
import yaml

data_directory = Path("../data/")

comment_files = list(data_directory.rglob("*.md"))
authorSet = set()

for i in comment_files:
  if i.parent.parent != data_directory:
    continue
  itemName = i.name.rstrip(".md")
  collectionName = i.parent.name
  os.makedirs(i.parent / itemName, exist_ok=True)
  post = frontmatter.load(i)
  meta = {
    "name": post['name'],
    "aliases": post['common_names'],
    "links": post['link'],
  }
  if post.get("image"):
    meta['image'] = post['image']
  if post.get("meta"):
    meta['meta'] = post['meta']
  comments = post['comments']
  with open(i.parent / itemName / 'meta.yaml', 'w') as f:
    yaml.dump(meta, f, allow_unicode=True, sort_keys=False)
  for c in comments:
    cmeta = {
      "tags": c['tags'],
      "score": c['score'],
      "date": c['date'],  # date may need manual intervention
    }
    author = c['commenter']
    contents = c['content']
    authorSet.add(author)

    fmatter = yaml.dump(cmeta, allow_unicode=True, sort_keys=False)
    with open(i.parent / itemName / f'{author}.md', 'w') as f:
      f.write("---\n")
      f.write(fmatter)
      f.write("---\n\n")
      f.write(contents)

authors = {}
for i in authorSet:
  authors[i] = {
    'name': i,
    'avatar': ""
  }
with open(data_directory / "authors.yaml", "w") as f:
  yaml.dump(authors, f, sort_keys=False)
