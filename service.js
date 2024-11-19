const fs = require("fs");
const path = require("path");

// 解析日期
function parseDateFromTitle(title) {
  const regex = /📆\s*(\d{4}年\d{2}月\d{2}日)/;
  const match = title.match(regex);
  if (match) {
    return match[1].replace(/年|月/g, "-").replace("日", "");
  }
  return null;
}

// 解析文件内容
function parseFileContent(content) {
  const lines = content.split("\n");
  const result = [];
  let currentBlock = null;
  let lastDate = null;
  const sentences = [];

  lines.forEach((line) => {
    if (line.startsWith("∞∞∞markdown")) {
      if (currentBlock && currentBlock.title) {
        result.push(currentBlock);
      }
      currentBlock = {
        id: result.length + 1,
        title: "",
        date: null,
        section: "",
        word_count: 0,
        content: "",
        href: "", // 添加 href 字段
      };
    } else if (currentBlock) {
      if (line.startsWith("# 📆") || line.startsWith("# 📘")) {
        if (currentBlock.title) {
          result.push(currentBlock);
          currentBlock = {
            id: result.length + 1,
            title: "",
            date: null,
            section: "",
            word_count: 0,
            content: "",
            href: "", // 添加 href 字段
          };
        }

        currentBlock.title = line;
        currentBlock.date = parseDateFromTitle(line);
        currentBlock.section = line.includes("📆") ? "📆" : "📘";

        // 如果是 # 📆 标题，更新 lastDate
        if (currentBlock.section === "📆" && currentBlock.date) {
          lastDate = currentBlock.date;
        }

        // 如果是 # 📘 标题，并且没有日期，使用 lastDate
        if (currentBlock.section === "📘" && !currentBlock.date) {
          currentBlock.date = lastDate;
        }
      } else if (currentBlock.title) {
        currentBlock.content += line + "\n";
      }
    }

    // 提取包含 #句子 的行
    if (line.includes("#句子")) {
      sentences.push(line.replace("#句子", "").trim());
    }
  });

  if (currentBlock && currentBlock.title) {
    result.push(currentBlock);
  }

  // 过滤掉没有标题的块
  const filteredResult = result.filter((item) => item.title);

  // 计算字数
  filteredResult.forEach((item) => {
    // 去除两端空白字符，并且去除中间的空白字符和特殊符号（如换行符 \n）
    item.word_count = item.content.trim().replace(/\s+/g, "").length;
    // 生成 href 字段
    item.href = `article.html?id=${item.id}`;
  });

  return { parsedData: filteredResult, sentences };
}

// 读取文件并解析
function readAndParseFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        const parsedData = parseFileContent(data);
        resolve(parsedData);
      }
    });
  });
}

// 覆盖 data.json 文件
function writeDataToJsonFile(data, filePath) {
  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFile(filePath, jsonData, "utf8", (err) => {
    if (err) {
      console.error("Error writing to data.json:", err);
    } else {
      console.log("Data successfully written to data.json");
    }
  });
}

// 覆盖 sentence.json 文件
function writeSentencesToJsonFile(sentences, filePath) {
  const jsonData = JSON.stringify({ sentences }, null, 2);
  fs.writeFile(filePath, jsonData, "utf8", (err) => {
    if (err) {
      console.error("Error writing to sentence.json:", err);
    } else {
      console.log("Data successfully written to sentence.json");
    }
  });
}

// 主函数
async function main() {
  const bufferFilePath = path.join(
    "C:",
    "99",
    "document",
    "heynote",
    "buffer.txt"
  );
  const dataFilePath = path.join(__dirname, "data.json");
  const sentenceFilePath = path.join(__dirname, "sentence.json");

  try {
    const { parsedData, sentences } = await readAndParseFile(bufferFilePath);
    writeDataToJsonFile(parsedData, dataFilePath);
    writeSentencesToJsonFile(sentences, sentenceFilePath);
  } catch (err) {
    console.error("Error processing file:", err);
  }
}

main();
