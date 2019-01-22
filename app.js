// ---- グローバル変数 -----------------------------------------------------
/**
 * アイテム数カウンター
 *@type {*number}
 */
let item_counter = 0;

// ==== イベント定義 ========================================================
// ロードイベント
window.onload = onLoad;

// 追加ボタンクリック
document.getElementById("get_todo").addEventListener("click", () => {
  // タスクと時刻を取る
  const input_text = document.getElementById("input_text").value;
  const input_date = document.getElementById("input_date").value;
  const input_priority = document.getElementById("input_priority").value;
  // リスト作成メソッド
  addTodo(input_text, input_date, input_priority);
  // 初期化
  document.getElementById("input_text").value = "";
  document.getElementById("input_date").value = "";
  document.getElementById("input_priority").value = "high";
});

// ===========================================================================

/**
 *onLoad
 *カレンダーライブラリの利用を宣言
 */
function onLoad() {
  const todo_time = document.getElementById("input_date");
  let fp = flatpickr(todo_time, {
    enableTime: true,
    dateFormat: "Y/m/d H:i"
  });
}
/**
 *テキストに打ち消し線を追加
 *
 * @param {*object} complete_todo
 */
function clickCompleteButton(complete_todo) {
  const line_flag = complete_todo.getAttribute('complete');
  if ( String( line_flag ) === "false") {
    /**
     * 親要素
     * @param {*object}
     */
    const td = complete_todo.parentNode;
    /**
     * タスク要素をとる
     * @param {*object}
     */
    const item_task = td.parentNode.getElementsByClassName("item_task");
    item_task[0].style.textDecoration = "line-through";

    complete_todo.setAttribute("complete", "true");
  }
}

/**
 *addTodo
 * TODOリストを作成
 * @param {*string} todo_text
 * @param {*string} todo_time
 * @param {*string} todo_priority
 */
function addTodo(todo_text, todo_time, todo_priority) {
  /**
   * タスク分類オブジェクト
   * @param {*object}
   */
  const task_priority = {
    high: "高い",
    usually: "普通",
    low: "低い"
  };

  // テキストを生成
  /**
   * trタグ
   * @param {*object}
   */
  let item = document.createElement("tr");
  item.classList.add("todo_item");
  item.setAttribute("item_no", item_counter);

  /**
   * tdタグ(完了ボタン)
   * @param {*object}
   */
  let complete_button = document.createElement("td");
  /**
   * buttonタグ
   * @param {*object}
   */
  let button_element = document.createElement("button");
  button_element.classList.add("complete_todo");
  button_element.classList.add("button");
  button_element.classList.add("is-primary");
  button_element.classList.add("is-rounded");
  button_element.setAttribute("onclick", "clickCompleteButton( this )");
  button_element.setAttribute("complete", "flase");
  /**
   * アイコン
   * @param {*object}
   */
  let font_complete = document.createElement("i");
  font_complete.classList.add("fas");
  font_complete.classList.add("fa-check");
  // ボタン部分を追加
  button_element.appendChild(font_complete);
  complete_button.appendChild(button_element);
  item.appendChild(complete_button);

  /**
   * tdタグ(締め切り)
   * @param {*object}
   */
  let dead_line = document.createElement("td");
  dead_line.textContent = todo_time;
  item.appendChild(dead_line);

  /**
   * tdタグ(タスク)
   * @param {*object}
   */
  let todo_task = document.createElement("td");
  todo_task.textContent = todo_text;
  todo_task.classList.add("item_task");
  item.appendChild(todo_task);

  /**
   * tdタグ(優先度)
   * @param {*object}
   */
  let priority = document.createElement("td");
  if (todo_priority == "high") {
    priority.textContent = task_priority.high;
  } else if (todo_priority == "usually") {
    priority.textContent = task_priority.usually;
  } else if (todo_priority == "low") {
    priority.textContent == task_priority.low;
  }
  item.appendChild(priority);

  /**
   * tdタグ(削除)
   * @param {*object}
   */
  let todo_delete = document.createElement("td");
  /**
   * tdタグ(aタグ)
   * @param {*object}
   */
  let fa_times = document.createElement("button");
  fa_times.classList.add("delete_todo");
  fa_times.classList.add("button");
  fa_times.classList.add("is-danger");
  fa_times.classList.add("is-rounded");
  /**
   * tdタグ(iタグ)
   * @param {*object}
   */
  let font_delete = document.createElement("i");
  font_delete.classList.add("fas");
  font_delete.classList.add("fa-times");
  fa_times.appendChild(font_delete);
  todo_delete.appendChild(fa_times);
  item.appendChild(todo_delete);

  // やることエリアパネルへ表示
  document.getElementById("todo_list").appendChild(item);
  // item_counterを増やす
  item_counter = item_counter + 1;
}

/**
 * リストに対してイベントを定義する
 * グローバルに初めから定義するとDOMが存在しないのでエラーとなる
 */
// function addItemList(){
//   // 完了ボタン
//   document.getElementsByClassName('complete_todo').addEventListener('click', ()=>{
//   const complete_todo = this;
//   clickCompleteButton( complete_todo );
//   });
// }
