# 206hub

Rewritten in Next.js. (v2 alpha)

[![Next.js project check](https://github.com/ustclug-dev/206hub/actions/workflows/check.yml/badge.svg?branch=nextjs-ng)](https://github.com/ustclug-dev/206hub/actions/workflows/check.yml)

## Build

Install deps:

```
$ npm install
```

Development:

```
$ npm run dev
```

Static Site Generation Build:

```
$ npm run export
```

It will be generated to `out/` directory.

Lint and check file style:

```
$ npm run lint
```

## File structure

Data is in the `data/` folder.

```
.
├── anime
│   ├── is_the_order_a_rabbit
│   │   ├── meta.yaml
│   │   └── testB.md
│   └── k_on
│       ├── meta.yaml
│       ├── testA.md
│       └── testB.md
├── authors.yaml
├── book
│   └── csapp
│       ├── meta.yaml
│       └── testB.md
└── collections.yaml
```

`collections.yaml`:

```yaml
anime:
  name: 动画
book:
  name: 书籍
```

`authors.yaml`:

```yaml
testA:
  name: AAA
  avatar: ""
testB:
  name: BBB
  avatar: ""
testC:
  name: CCC
  avatar: ""
```

`${collection}/${item}/meta.yaml`:

```yaml
name: 深入理解计算机系统
aliases: ["Computer Systems: A Programmer's Perspective", CSAPP]
links:
  - source: 官网
    link: https://csapp.cs.cmu.edu/
meta:
  - name: ISBN
    value: 9787111321330
image: http://csapp.cs.cmu.edu/3e/images/csapp3e-cover.jpg
```

`${collection}/${item}/${author}.md`:

```markdown
---
tags: [计算机]
score: 9.5
date: 2021-01-01 12:00
---

Amazing!
```

The new file structure is more natural, as you don't need to put everything in YAML frontmatter.

### Add a collection

Take 'game' (游戏) as an example.

1. Create a folder `game` in `data/`
2. Append this to `collections.yaml`:
   ```yaml
   game:
     name: 游戏
   ```

### Add an item

Take 'Teeworlds' as an example.

1. Create folder `data/game/Teeworlds`
2. Create `data/game/Teeworlds/meta.yaml` with following contents:
   ```yaml
   name: Teeworlds
   aliases:
     - Teeworlds
     - tws
   links:
     - source: Wikipedia
       link: https://en.wikipedia.org/wiki/Teeworlds
     - source: Teeworlds.com
       link: https://www.teeworlds.com/
     - source: steam
       link: https://store.steampowered.com/app/380840/Teeworlds/
   meta:
     - name: test
       value: test
   image: https://www.teeworlds.com/images/splashtee6.png
   ```

`meta`, `image` and `aliases` are optional.

### Add a comment

Assuming that you are 'testA'

1. First you shall add yourself to `data/authors.yaml`

   ```yaml
   testA:
     name: test A
     avatar: ""
   ```

   `avatar` is not used for now.

2. Create `data/game/Teeworlds/testA.md` with following contents:

   ```markdown
   ---
   tags:
     - Open-source
     - Multiplayer
     - Sidescrolling
   score: 9
   date: 2021-07-31 13:00
   ---

   Teeworlds is a **great** game.
   ```

   Notice:

   1. You can change global timezone in `config/site.js`. Date with timezone is not tested yet.
   2. 206hub trusts user's input, and does not sanitize user input for now.
