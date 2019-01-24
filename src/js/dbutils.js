/**
 * indexDBを定義
 * @param {*object}
 */
const db = new Dexie("todo_database");

/**
 * createDataBase
 * indexedDBを開く
 */
function createDataBase() {
  // ストアの定義
  db.version(2).stores({
    task_data: "&id"
  });

  db.version(1).stores({
    task_data: "&id,task,deadline,priority,complete,createdate,updatedate"
  });

  // データベースを開く
  db.open().catch(err => {
    console.error("Failed to open db in createDataBase: " + (err.stack || err));
  });
  //全件チェック => 複数のウインドウでタスクを共有したい場合
  //   db.task_data
  //     .toArray()
  //     .then(task_data => {
  //       console.log("Success to toArray in createDataBase");
  //       // レコードの数をチェック
  //       if (task_data.length !== 0) {
  //         // レコードを表示する
  //         for (let i = 0; i < task_data.length; i++) {
  //           let task = task_data[i];
  //           item_counter = task.id;
  //           addTodo(task.task, task.deadline, task.priority);
  //         }
  //       }
  //     })
  //     .catch(err => {
  //       console.warn(
  //         "Failed to toArray in createDataBase: " + (err.stack || err)
  //       );
  //     });
  //全件削除
  deleteAllTask();
}

/**
 * existenceTask
 * 存在チェック
 * @param {*} id
 * @param {*} task
 * @param {*} deadline
 * @param {*} priority
 */
function existenceTask(id, task, deadline, priority) {
  showLoadModal();
  db.task_data
    .where({ id: id })
    .first(item => {
      if (item !== undefined) {
        console.log("Found task: " + JSON.stringify(item));
        addTodo(item.task, item.deadline, item.priority);
      } else {
        insertTaskData(id, task, deadline, priority);
      }
    })
    .catch(error => {
      closeModal();
      console.error(error.stack || error);
    });
}

/**
 * insertTaskData
 * 登録されたタスクのデータを格納
 * @param {*string} id
 * @param {*string} task
 * @param {*string} deadline
 * @param {*string} priority
 */
function insertTaskData(id, task, deadline, priority) {
  showLoadModal();
  // 日付生成
  const date = new Date();
  // 追加する
  db.task_data
    .add({
      id: id,
      task: task,
      deadline: deadline,
      priority: priority,
      complete: 0,
      createdate: date,
      updatedate: date
    })
    .then(() => {
      console.log("Success to add in insertTaskData");
      addTodo(task, deadline, priority);
    })
    .catch(err => {
      closeModal();
      console.warn("Failed to add in insertTaskData: " + (err.stack || err));
    });
}

/**
 * updateComplete
 * 完了フラグ更新
 * @param {*number} id
 * @param {*number} iscomplete
 */
function updateComplete(id, iscomplete) {
  showLoadModal();

  db.task_data
    .update(id, {
      complete: iscomplete,
      updatedate: new Date()
    })
    .then(updated => {
      console.log("Success to update in updateComplete:" + updated);
    })
    .catch(err => {
      console.warn("Failed to update in updateComplete: " + (err.stack || err));
    })
    .finally(() => {
      closeModal();
    });
}

/**
 * deleteTask
 * タスクを削除する
 * @param {*number} id
 */
function deleteTask(id) {
  showLoadModal();
  db.task_data
    .delete(id)
    .then(() => {
      console.log("Success to delete in deleteTask");
    })
    .catch(err => {
      closeModal();
      console.warn("Failed to delete in deleteTask: " + (err.stack || err));
    })
    .finally(() => {
      closeModal();
    });
}

/**
 * deleteAllTask
 * すべてのタスクを削除する
 */
function deleteAllTask() {
  showLoadModal();
  db.task_data
    .clear()
    .then(() => {
      console.log("Success to clear in deleteAllTask");
    })
    .catch(err => {
      console.warn("Failed to clear in deleteAllTask: " + (err.stack || err));
    })
    .finally(() => {
      closeModal();
    });
}
