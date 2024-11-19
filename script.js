// 字符串转换为时间格式
function parseDate(str) {
  return new Date(str);
}

// 获取本周的星期天作为开始时间
function getThisSunday(date) {
  const dayOfWeek = date.getDay();
  const daysToSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
  const thisSunday = new Date(date);
  thisSunday.setDate(thisSunday.getDate() + daysToSunday);
  return thisSunday;
}

const today = new Date();
console.log("today:", today);
const sunday = getThisSunday(today);
let startDate = new Date(sunday);
console.log("sunday Date:", startDate);

// 计算当前是第几周
const startOfYear = new Date(today.getFullYear(), 0, 1);
const dayOfYear = Math.ceil((today - startOfYear) / (1000 * 60 * 60 * 24));
const weekNumber = Math.floor((dayOfYear - 1) / 7) + 1;

// 展示若干周的数据，周数乘以 7 再减去 1（最开始的周数是2024年的第35周）
// 默认展示的周数
let weeks = weekNumber - 35 + 1;
let days = weeks * 7 - 1;
startDate.setDate(sunday.getDate() - days);

// 构建基础数据
function dateBuild(data) {
  const dateCounts = {};
  // 标准化json中的时间格式
  data.forEach((item) => {
    const dateStr = parseDate(item.date).toISOString().split("T")[0];
    dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
  });

  const result = [];
  // 生成70天的数据数组
  for (
    let currentDate = sunday;
    currentDate >= startDate;
    currentDate.setDate(currentDate.getDate() - 1)
  ) {
    const dateStr = currentDate.toISOString().split("T")[0];
    const count = dateCounts[dateStr] || 0;
    // 通过时间去json数据获取当天的文章
    const dataContent = data.filter(
      (item) => parseDate(item.date).toISOString().split("T")[0] === dateStr
    );

    // 统计文章字符总数
    let sumOfWordcounts = 0;
    dataContent.forEach((item) => {
      sumOfWordcounts += item.word_count;
    });

    // 放进数组中
    result.push({
      date: dateStr,
      count: count,
      data: dataContent,
      wordcount: sumOfWordcounts,
    });
  }

  return result;
}

// 填充数据
function fillGrid(data) {
  // 先将构建用于渲染的数据
  let articles = dateBuild(data);
  // 获取热力图元素
  const gridContainer = document.getElementById("relitu-container");
  // 构建grid-item元素
  const gridItemTemplate = document.createElement("div");
  gridItemTemplate.className = "grid-item";

  // 计算全部日记和笔记的数量
  let diaryCount = 0;
  let noteCount = 0;
  let totalWordCount = 0;
  data.forEach((item) => {
    if (item.section === "📆") {
      diaryCount++;
    } else if (item.section === "📘") {
      noteCount++;
    }
    totalWordCount += item.word_count;
  });

  // 更新显示日记和笔记数量的元素
  const diaryCountElement = document.getElementById("diary-count");
  const noteCountElement = document.getElementById("note-count");
  const totalWordCountElement = document.getElementById("total-word-count");
  if (diaryCountElement && noteCountElement && totalWordCountElement) {
    diaryCountElement.innerText = diaryCount;
    noteCountElement.innerText = noteCount;
    totalWordCountElement.innerText = totalWordCount;
  }

  // 倒序遍历文章数据
  articles
    .slice()
    .reverse()
    .forEach((article, index) => {
      const gridItem = gridItemTemplate.cloneNode(false);
      // 构建提示字符串
      const tooltipStr = article.data
        .map(
          (item, i) =>
            `- <a href='${item.href}' target='_blank'>${item.title}</a></br>`
        )
        .join(" ");
      // 构建grid-info中的信息
      // 格子颜色 绿色 ? `rgba(77, 208, 90,${article.wordcount / 5000 + 0.2})`
      const backgroundColor =
        article.wordcount != 0
          ? `rgba(30,129,248,${article.wordcount / 5000 + 0.2})`
          : "#E9ECEF";
      gridItem.innerHTML = `<div class="item-info item-tippy" data-date="${article.date}" data-tippy-content="${article.date}，共 ${article.count} 篇，共 ${article.wordcount} 字<br />${tooltipStr}" style="background-color:${backgroundColor}"></div>`;

      // 计算排列顺序
      const colIndex = Math.floor(index / 7);
      const rowIndex = index % 7;

      if (rowIndex === 0) {
        const gridColumn = document.createElement("div");
        gridColumn.className = "grid-column";
        gridContainer.appendChild(gridColumn);
      }
      // 根据顺序构建
      const gridColumns = document.getElementsByClassName("grid-column");
      if (gridColumns[colIndex]) {
        gridColumns[colIndex].append(gridItem);
      } else {
        // 如果列索引超出了当前已有的列，需要创建新的列
        const newColumn = document.createElement("div");
        newColumn.className = "grid-column";
        gridContainer.appendChild(newColumn);
        newColumn.append(gridItem);
      }
    });

  // 生成笔记列表
  const noteListContainer = document.getElementById("note-list");
  const noteListTemplate = document.createElement("div");
  noteListTemplate.className = "note-item";

  data
    .filter((item) => item.section === "📘")
    .forEach((note) => {
      const noteItem = noteListTemplate.cloneNode(false);
      const date = new Date(note.date)
        .toLocaleDateString("zh-CN", {
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/\//g, "-");
      const title = note.title.replace(/^# 📘\s*/, ""); // 去掉标题中的 # 📘
      noteItem.innerHTML = `<a href="${note.href}" target="_blank">${date} &nbsp;&nbsp;&nbsp; ${title}</a>`;
      noteListContainer.appendChild(noteItem);
    });

  // 动态生成星期标签
  const weekLabels = ["一", "三", "五", "日"];
  const weeksDifference = Math.floor(days / 7);
  for (let i = 0; i < weekLabels.length; i++) {
    const label = document.createElement("div");
    label.className = "week-label";
    label.innerText = weekLabels[i];
    label.style.gridColumn = `${weeksDifference + 1} / ${weeksDifference + 2}`;
    label.style.gridRow = `${i * 2 + 1} / ${i * 2 + 2}`;
    gridContainer.appendChild(label);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const loadingSpinner = document.getElementById("loading-spinner");
  loadingSpinner.style.display = "flex"; // 显示加载动画

  fetch("data.json")
    .then((response) => response.json())
    .then((posts) => {
      fillGrid(posts);
      tippy(".item-tippy", {
        allowHTML: true,
        interactive: true,
        maxWidth: "none",
        appendTo: () => document.body,
      });

      // 添加随机文章跳转功能
      // const randomArticleButton = document.getElementById("random-article");
      // randomArticleButton.addEventListener("click", function (event) {
      //   event.preventDefault();
      //   const randomIndex = Math.floor(Math.random() * posts.length);
      //   const randomArticle = posts[randomIndex];
      //   window.open(randomArticle.href, "_blank");
      // });

      // 添加随机笔记跳转功能
      const randomNoteButton = document.getElementById("random-note");
      randomNoteButton.addEventListener("click", function (event) {
        event.preventDefault();
        const notes = posts.filter((item) => item.section === "📘");
        const randomIndex = Math.floor(Math.random() * notes.length);
        const randomNote = notes[randomIndex];
        window.open(randomNote.href, "_blank");
      });

      // 添加随机日记跳转功能
      const randomDiaryButton = document.getElementById("random-diary");
      randomDiaryButton.addEventListener("click", function (event) {
        event.preventDefault();
        const diaries = posts.filter((item) => item.section === "📆");
        const randomIndex = Math.floor(Math.random() * diaries.length);
        const randomDiary = diaries[randomIndex];
        window.open(randomDiary.href, "_blank");
      });

      // 获取随机句子
      fetch("sentence.json")
        .then((response) => response.json())
        .then((sentences) => {
          const randomIndex = Math.floor(
            Math.random() * sentences.sentences.length
          );
          const randomSentence = sentences.sentences[randomIndex];
          const randomSentenceDiv = document.getElementById("random-sentence");
          randomSentenceDiv.innerHTML = `<span>「${randomSentence}」</span>`;
        });
    })
    .finally(() => {
      loadingSpinner.style.display = "none"; // 隐藏加载动画
    });
});
