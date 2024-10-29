> 参考：  
> [我也出一版纯 CSS+JS 热力图 | @1900'Blog - All work and no play makes Jack a dull boy](https://1900.live/wo-ye-chu-yi-ban-chun-css-jsre-li-tu/)  
> [Markdown 转 HTML 脚本详情 - 快捷命令脚本共享平台](https://qc.qaz.ink/script/info/221)

# HeyNote 热力图

## 项目概述

这个项目旨在从 HeyNote `buffer.txt` 文件中解析内容，并生成一个热力图，以直观地展示最近的日记和笔记情况。热力图将根据日期和文章内容的字数来展示，帮助用户快速了解最近的活动分布。此外，用户可以通过点击热力图中的文章链接，在新标签页中查看文章的详细内容。

## 功能特性

- **文件解析**：从指定的文本文件中解析内容，提取标题、日期、块内容等信息。
- **日期解析**：从标题中提取日期信息，并为每个 `# 📘` 标题找到它上面最近的 `# 📆` 标题的日期。
- **字数统计**：计算每个块内容的字数，并将其作为热力图的填充依据。
- **热力图生成**：根据解析后的数据生成热力图，展示最近的日记和笔记情况。
- **数据存储**：将解析后的数据存储到 `data.json` 文件中，便于后续使用和分析。
- **文章详情展示**：用户可以通过点击热力图中的文章链接，在新标签页中查看文章的详细内容，包括标题和 Markdown 格式的内容。

## 文件结构

```
.
├── index.html
├── article.html
├── style.css
├── script.js
├── service.js
├── buffer.txt
└── data.json
```

- **README.md**：项目说明文档。
- **index.html**：网页模板，用于展示热力图。
- **article.html**：用于显示文章详细内容的页面。
- **data.json**：存储解析后的数据。
- **buffer.txt**：输入文件，包含需要解析的内容。
- **service.js**：负责文件解析、数据处理。

## 使用说明

### 1. 准备输入文件

将需要解析的内容放入 HeyNote `buffer.txt` 文件中。文件内容格式如下：

```
∞∞∞markdown
# 📆 2024年10月28日 周一44周
块内容
∞∞∞markdown
# 📘 前端 .gitignore 文件
块内容
∞∞∞markdown
# 📘 如何获取知乎图片的原图链接
块内容
∞∞∞markdown
# 📆 2024年10月27日 周日43周
块内容
∞∞∞markdown
# 📘 🟨 批量拉黑哔哩哔哩UP
块内容
```

### 2. 运行脚本

在 Node.js 环境中运行 `service.js` 脚本：

```bash
node service.js
```

### 3. 查看结果

脚本运行后，解析后的数据将存储在 data.json 文件中，之后 index.html 将读取该文件并生成热力图。用户可以通过点击热力图中的文章链接，在新标签页中查看文章的详细内容，包括标题和 Markdown 格式的内容。

## 贡献

欢迎贡献代码和提出改进建议！请提交 Pull Request 或 Issue。

## 许可证

MIT License

---

希望这个 `README.md` 文件能帮助你更好地理解和使用这个项目。如果你有任何其他需求或问题，随时告诉我！
