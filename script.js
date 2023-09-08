const listContainer = document.getElementById("list-container");
const inputBox = document.getElementById("input-box");
// inputBox를 출력하면 input요소 <input type.. id...> 가 출력된다.
// 현재 inputBox에 들어가 있는 속성은 type, id, placeholder
// input태그의 경우 사용자가 무언가를 입력 시, 그 입력된 문자가 value속성의 값이된다.
// 그렇기에, 사용자가 입력한 값을 받아오기 위해 inputBox에 value 속성을 접근하는 것

function addTask() {
  if (inputBox.value === "") {
    alert("You must write something!");
  } else {
    let li = document.createElement("li");
    // innerHTML을 사용할 경우 해당 요소의 여는 태그('<'), 닫는 태그('>') 사이를 지정
    li.innerHTML = inputBox.value;
    listContainer.appendChild(li);
    let span = document.createElement("span");
    span.innerHTML = "\u00d7";
    li.appendChild(span);
    let edit = document.createElement("img");
    edit.innerHTML = `<img src="images/edit.png"></img>`;
    li.appendChild(edit);
  }
  // 여기서 inputBox의 value를 공백으로 초기화해주지 않으면, 이전에 썼던 input.value의 값이
  // 그대로 사용자 화면에 보이는 inputBox에 보이게 됨
  inputBox.value = "";
  saveData();
}

// listContainer에 해당 이벤트가 발생하면,
// 인자 e가 자동으로 eventlistener의 콜백함수 인자로 전달된다.
// 여기서 사용되는 인자 e는 이벤트 객체로써 event라는 이름으로 사용되기도 한다.
// 이벤트 객체는 이벤트에 대한 정보를 가지고 있으며 이를 개발자가 접근할 수 있게 해준다.
// 여기서 정보란 아래의 코드에서 사용된 바와 같이, e가 발생한 곳이(마우스로 클릭한 부분)
// LI 인지 SPAN 혹은 두 곳이 아닌 다른곳인지의 여부에 대한 정보를 의미한다.

listContainer.addEventListener(
  "click",
  function (e) {
    if (e.target.tagName === "LI") {
      // toggle은 한번 누르면 on, 한번 더 누르면 off가 되는 버튼을 생각하면 편하다
      // 아래 코드에선, 'li'요소 클릭 시, 그 li의 클래스가 checked인지 확인 후, 맞다면 checked해제, 아니라면 checked적용
      e.target.classList.toggle("checked");
      saveData();
    } else if (e.target.tagName === "SPAN") {
      // span요소는 li요소의 자식 요소다. 그렇기에 삭제버튼인 span을 누르면 그 부모인 tasklist 역할을 하는 li요소를 삭제
      e.target.parentElement.remove();
      saveData();
    } else if (e.target.tagName === "IMG") {
      const parentElement = e.target.parentElement;
      parentElement.contentEditable = true;
      parentElement.focus();

      const beforePseudoElement = getComputedStyle(parentElement, "::before");

      const beforeContentLength = beforePseudoElement
        ? beforePseudoElement.content.length - 2
        : 0; // Subtract 2 to remove the double quotes

      const range = document.createRange();
      const selection = window.getSelection();

      range.setStart(parentElement.firstChild, beforeContentLength);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);

      const listItems = document.querySelectorAll("li[contenteditable=true]");

      listItems.forEach((li) => {
        li.addEventListener("input", function () {
          saveData();
        });
      });
    }
  },
  // default값은 false이다. true일 경우 capturing phase, false일 경우 bubbling phase 방식으로 이벤트가 작동한다.
  // 간단하게 capturing phase의 경우 부모부터 시작해서 최종적으로는 자식 요소에게 영향을 미치는 방식
  // bubbling phase의 경우 자식 요소로부터 시작해서 최종적으로는 부모 요소에게 영향을 미치는 방식인 듯 하다.
  false
);

function saveData() {
  localStorage.setItem("data", listContainer.innerHTML);
}

function showTask() {
  listContainer.innerHTML = localStorage.getItem("data");
}

showTask();
