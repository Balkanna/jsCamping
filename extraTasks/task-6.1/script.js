const list = [
  {
    value: "Пункт 1.",
    children: null,
  },
  {
    value: "Пункт 2.",
    children: [
      {
        value: "Подпункт 2.1.",
        children: null,
      },
      {
        value: "Подпункт 2.2.",
        children: [
          {
            value: "Подпункт 2.2.1.",
            children: null,
          },
          {
            value: "Подпункт 2.2.2.",
            children: null,
          },
        ],
      },
      {
        value: "Подпункт 2.3.",
        children: null,
      },
    ],
  },
  {
    value: "Пункт 3.",
    children: null,
  },
];

const body = document.body;
const htmlList = [];

const createRecursiveList = (list) => {
  htmlList.push('<ul style="font-size: 90%">');
  list.forEach( item => {
    htmlList.push("<li style='cursor: pointer'>" + item.value);
    if (item.children) {
      createRecursiveList(item.children);
    }
    htmlList.push("</li>");
  });
  htmlList.push("</ul>");
  return htmlList.join("");
};

const createList = (title, list) => {
  const html = document.createElement("div");
  const h2 = document.createElement("h2");

  h2.innerText = title;
  const createdlist = createRecursiveList(list);

  html.addEventListener("click", ({target}) => {
    if(target.tagName !== 'LI') return;

    const innerList = target.querySelector("ul");
    if (!innerList) return;

    innerList.style.display =
      innerList.style.display === "block" || innerList.style.display === '' ? "none" : "block";
  });
 
  html.appendChild(h2);
  html.insertAdjacentHTML("beforeend", createdlist);

  return html;
};
const createdList = createList("Заголовок", list);
body.appendChild(createdList);