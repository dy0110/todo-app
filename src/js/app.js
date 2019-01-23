// ---- グローバル変数 -----------------------------------------------------
/**
 * アイテム数カウンター
 *@type {*number}
 */
let item_counter = 0;
/**
 * 削除オブジェクト
 * @type {*object}
 */
let delete_obj;
/**
 * モーダル収納用オブジェクト
 * @type {*array}
 */
const targets = document.getElementsByClassName("close_modal");
// ==== イベント定義 ========================================================
// ロードイベント
window.onload = onLoad;

// 追加ボタンクリック
document.getElementById("get_todo").addEventListener("click", () => {
  // タスクと時刻を取る
  const input_text = document.getElementById("input_text").value;
  const input_date = document.getElementById("input_date").value;
  const input_priority = document.getElementById("input_priority").value;

  if (input_text === "" && input_date === "") {
    // エラーメッセージを出す
    showModal("", "error");
    document.getElementById("error_message_area").textContent = NOTEXT;
    return;
  } else if (input_text === "") {
    // エラーメッセージを出す
    showModal("", "error");
    document.getElementById("error_message_area").textContent = NOINPUTEXT;
    return;
  } else if (input_date === "") {
    // エラーメッセージを出す
    showModal("", "error");
    document.getElementById("error_message_area").textContent = NOINPUTDATE;
    return;
  }

  // リスト作成メソッド
  addTodo(input_text, input_date, input_priority);
  // 初期化
  document.getElementById("input_text").value = "";
  document.getElementById("input_date").value = "";
  document.getElementById("input_priority").value = "high";
});

// 全件削除ボタンクリック
document.getElementById("delete_all_todo").addEventListener("click", () => {
  // 作成メソッド呼び出し
  deleteAllTodo();
});

// TODO削除ボタン(1行)
document.getElementById("delete_todo_list").addEventListener("click", () => {
  deleteTodo();
});

// モーダル削除ボタン
// 複数存在するクラスにはforで個数分イベントを設定しなければならない
for (let i = 0; i < targets.length; i++) {
  //クリックイベントでモーダル閉じる
  targets[i].addEventListener(
    "click",
    () => {
      closeModal();
    },
    false
  );
}

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
  /**
   * tdタグ
   * @param {*object}
   */
  const td = complete_todo.parentNode;
  /**
   * trタグ
   * @param {*object}
   */
  const tr = td.parentNode;
  /**
   * タスク要素に打消し戦を追加
   * @param {*object}
   */
  const item_task = tr.getElementsByClassName("item_task");
  /**
   * 削除ボタンオブジェクト
   * @param {*object}
   */
  const delete_button = tr.getElementsByClassName("delete_todo");

  // 行のカラーをグレーに
  tr.style.backgroundColor = "lightgray";
  item_task[0].style.textDecoration = "line-through";

  // ボタンの見た目を変更する
  complete_todo.classList.add("is-inverted");
  delete_button[0].classList.add("is-inverted");

  // ボタンのアイコンを変える
  complete_todo.innerHTML = "";
  complete_todo.innerHTML = '<i class="fas fa-clipboard-check"></i>';

  // クリックイベントの更新
  complete_todo.setAttribute("onclick", "clickIncompleteButton(this)");
}

/**
 * 打ち消し線を元に戻す
 *
 * @param {*object} incomplete_todo
 */
function clickIncompleteButton(incomplete_todo) {
  /**
   * tdタグ
   */
  const td = incomplete_todo.parentNode;

  /**
   * 親要素
   * @param {*object}
   */
  const tr = td.parentNode;
  /**
   * タスク要素から打消し戦をとる
   * @param {*object}
   */
  const item_task = tr.getElementsByClassName("item_task");
  /**
   * 削除ボタンオブジェクト
   * @param {*object}
   */
  const delete_button = tr.getElementsByClassName("delete_todo ");

  //行のカラーを戻す
  tr.style.backgroundColor = "";
  //打ち消し線の削除
  item_task[0].style.textDecoration = "";

  // ボタンの見た目を変更する
  incomplete_todo.classList.remove("is-inverted");
  delete_button[0].classList.remove("is-inverted");

  // ボタンのアイコンを変える
  incomplete_todo.innerHTML = "";
  incomplete_todo.innerHTML = '<i class="fas fa-clipboard"></i>';

  // クリックイベントの更新
  incomplete_todo.setAttribute("onclick", "clickCompleteButton(this)");
}

/**
 * 削除メソッド
 *
 */
function deleteTodo() {
  /**
   * 削除htmlオブジェクト
   * @param {*object}
   */
  const delete_todo = delete_obj;
  /**
   * 親要素
   * @param {*object}
   */
  const td = delete_todo.parentNode;
  /**
   * trタグ
   * @param {*object}
   */
  const tr = td.parentNode;

  // 列の削除
  tr.remove();
  // モーダルを閉じる
  closeModal();
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
  let todo_complete = document.createElement("td");
  /**
   * buttonタグ
   * @param {*object}
   */
  let complete_button = document.createElement("button");
  complete_button.classList.add("complete_todo");
  complete_button.classList.add("button");
  complete_button.classList.add("is-primary");
  complete_button.classList.add("is-rounded");
  complete_button.setAttribute("onclick", "clickCompleteButton( this )");
  /**
   * アイコン
   * @param {*object}
   */
  let font_complete = document.createElement("i");
  font_complete.classList.add("fas");
  font_complete.classList.add("fa-clipboard");
  // ボタン部分を追加
  complete_button.appendChild(font_complete);
  todo_complete.appendChild(complete_button);
  item.appendChild(todo_complete);

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
    priority.textContent = task_priority.low;
  }
  item.appendChild(priority);

  /**
   * tdタグ(削除)
   * @param {*object}
   */
  let todo_delete = document.createElement("td");
  /**
   *  buttonタグ
   * @param {*object}
   */
  let delete_button = document.createElement("button");
  delete_button.classList.add("button");
  delete_button.classList.add("is-danger");
  delete_button.classList.add("is-rounded");
  delete_button.classList.add("delete_todo");
  delete_button.setAttribute("onclick", 'showModal(this,"one")');
  /**
   * iタグ
   * @param {*object}
   */
  let font_delete = document.createElement("i");
  font_delete.classList.add("fas");
  font_delete.classList.add("fa-times");
  delete_button.appendChild(font_delete);
  todo_delete.appendChild(delete_button);
  item.appendChild(todo_delete);

  // やることエリアパネルへ表示
  document.getElementById("todo_list").appendChild(item);
  // item_counterを増やす
  item_counter = item_counter + 1;
}

/**
 *タスクを全て削除する
 *
 */
function deleteAllTodo() {
  // タスク表を取得して削除する
  const todo_list = document.getElementById("todo_list");
  todo_list.remove();
  // モーダルを閉じる
  closeModal();
}

/**
 * モーダルを表示する
 *
 * @param {*object} obj
 * @param {*string} type
 */
function showModal(obj, type) {
  //const on_click = obj.getAttribute('onclick');

  // モーダルを表示
  if (type === "one") {
    // 単体削除
    document.getElementById("todo_delete_modal").classList.add("is-active");
  } else if (type === "all") {
    //全体削除
    const children_count = document.getElementById("todo_list")
      .childElementCount;
    if (children_count === 0) {
      // エラーメッセージの差し込み
      document.getElementById("error_message_area").textContent = NOTODOITEMS;
      document.getElementById("error_modal").classList.add("is-active");
    } else {
      document
        .getElementById("all_todo_delete_modal")
        .classList.add("is-active");
    }
  } else if (type === "error") {
    document.getElementById("error_modal").classList.add("is-active");
  }
  // 削除対象のオブジェクトを格納
  delete_obj = obj;
}

/**
 * モーダルを隠す
 *
 */
function closeModal() {
  // 開いたモーダルの取得
  const modal = document.querySelector("div.modal.is-active");
  // モーダルを隠す
  modal.classList.remove("is-active");
}
