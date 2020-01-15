---
---

# 所有分类

{% comment %}
在 Jekyll 的 site.collections 中，posts 是默认硬编码在其中的。所以，在循环时，必须手动排除 posts。
{% endcomment %}

{% for collection in site.collections %}
    {% if collection.label != "posts" %}
- {{ collection.label }}
    {% endif %}
{% endfor %}
