# 206hub
206 的物品评论与交流平台

## 计划的功能

- 可以新建分类（如「动画」）并定义结构。 可以新建项（如「轻音少女」），填充项的详细内容（如「轻音少女」的动画制作是「京都动画」），为项添加点评，标记某项为想要/看。
- 显示某个分类的总列表，以各种方式排序的需求。
- ~~[Optional, 如果使用后端的实现] 统一身份认证登录，并且有登录白名单限制。~~
- 用户可以自由导出自己的数据。

## 如何使用？

### 配置环境

1. 你需要安装 Ruby 的环境，并使用 `gem` 安装 `bundler`。
2. 在本目录执行 `bundle install` 安装相关依赖。在安装时，也可以使用 `bundle install --path=vendor/bundle`，使其安装的包限制在本项目的范围中。
3. 搞定~

### 运行

`bundle exec jekyll s`: 生成静态文件到 `_site`，并启动 Web 服务器。

`bundle exec jekyll b`: 仅生成静态文件。

### 添加分类

「分类」使用 Jekyll 的 collections。为了添加分类，你需要：

1. 修改 `_config.yml` 的 `collections` 部分。格式如下：
    ```yaml
    collections:
        anime:
            output: true
            name: 动画
        book:
            output: true
            name: 书籍
    ```
    其中每一项的 `output: true` **是必要的**，否则不会生成对应的 HTML 文件。`name` 用于其显示给用户的名字。
2. 在项目根目录新建以 `_` 开头，后面为分类名称的文件夹。

注意：请不要将你的分类命名为 `about`, `commenters`, `posts`, `search` 或 `tag`。

### 为分类添加项

每一项是一个 Markdown 文件。项的所有信息都包含在 YAML front matter 中。格式大概长成这个样子:

```yaml
---
name: 深入理解计算机系统
common_names: ["Computer Systems: A Programmer's Perspective", CSAPP]
link:
    - source: 官网
      link: https://csapp.cs.cmu.edu/
meta:
    - name: ISBN
      value: 9787111321330
comments:
    - commenter: user1
      tags: [计算机]
      score: 9.5
      date: 2020-02-16 17:35
      content: |
        Amazing!
    - commenter: user2
      tags: [testtag1, testtag2, "test tag 3"]
      score: 9
      date: 2020-01-12 00:06
      content: |
        This is a *test*.

        a test.
---
```

其中：
- `name`: 显示的、用户友好的名称。
- `common_names`: 别名/原名等。
- `link`: 放置相关的链接。
- `meta`: （可选）放置相关的其他信息。其中格式必须如样例一致。
- `comments`: 用户评论。每条评论的五个分项都必须包含，其中：
  - `score` 是一个整数或浮点数。约定范围在 [0, 10]。
  - `date` 格式为 `年-月-日 时:分`，可以不精确。**不要添加秒和时区偏差**，除非写评论的时候不在 CST 时区。
  - `content` 包含的内容为 Markdown 格式。对于多行文本，冒号后必须是 `|`。（备注：关于 YAML 格式的多行文本，详情可见 <https://yaml-multiline.info/>）

#### 如何写剧透？

格式是：

```markdown
<details markdown="1">
<summary>
  以下有剧透（你可以换成别的词，虽然这个 HTML 标签本来不是这么用的，只是刚好能够实现目的）。
</summary>
    
是剧透的

内容。
</details>
```

理论上的效果如下：

<details markdown="1">
<summary>
  以下有剧透（你可以换成别的词，虽然这个 HTML 标签本来不是这么用的，只是刚好能够实现目的）。
</summary>
    
是剧透的

内容。
</details>

注意：Kramdown（Jekyll 默认的 Markdown 渲染引擎）要求 `markdown="1"`，并且闭合的标签必须在新行行首，否则 Markdown 不会被正确渲染。详细内容见 <https://github.com/gettalong/kramdown/issues/155>。

未来可能会更换渲染引擎到 <https://github.com/github/jekyll-commonmark-ghpages>，与 GitHub 主站使用的一致。
