<template>
  <div id="todo-lists">

    <!-- Task List -->
    <div v-if="!selectedList" class="hide">
        <h2 class="task-list-title">My List</h2>
        
        <!-- Create a List-->
        <div class="add-list-form">
            <input
                   v-model="newList"
                   id="new-todo-input"
                   placeholder="Search | Create a List"
                   @keyup.enter="saveList"/>

            <button 
                   class="btn create" 
                   id="add-list" 
                   @click="saveList"
                   >
                   +
            </button>
        </div>

        <!-- Display all the List -->
        <ul>
            <li v-for="list in searchedLists" :key="list.list_id">
                <span 
                        @click="toggleSelected(list)">
                        {{list.list}}
                </span>
                <input
                        v-model="list.list" 
                        placeholder="Update the list name" 
                        v-if='listSelect' 
                        @keyup.enter="saveUpdatedListName (list)"
                />
                <button 
                        class="btn-delete" 
                        @click="deleteSelectedList(list)"
                        >
                        Delete
                </button>
                <button 
                        class="btn-edit" 
                        @click='editSelectedList' 
                        v-if='!listSelect'
                        >
                        Edit
                </button>
                <button 
                        class="btn-edit" 
                        @click="saveUpdatedListName (list)" 
                        v-if='listSelect'
                        >save
                </button>
            </li>
        </ul>

        <p
            class="empty-list"
            v-if="lists.length === 0">
            Pheww, List is Empty. Let's Chill & Netflix 🍕🍔🍺
        </p>
    </div>


    <!--Task list items -->
    <div v-if="selectedList" class="hide">
        <div class="todo-header">
            <h2 
                class="list-title" 
                id="listTitleElement"
                >
                {{ selectedList.list }}
            </h2>
        </div>

        <div class="add-list-form">
            <input
                    v-model="newItem"
                    id="new-todo-input"
                    placeholder="Search | Add List Item"
                    v-on:keyup.enter="saveListItem"
            />

            <button 
                    class="btn create" 
                    id="add-list" 
                    v-on:click="saveListItem"
                    >+
            </button>
        </div>
        <ul>
            <li 
                v-for="item in sortedItems" 
                :key="item.item_id"
                >
                <div>
                    <input 
                        type="checkbox" 
                        v-model="item.completed" 
                        @click="markComplete(item)"
                    />
                    <span 
                        :class="{strikeout: item.completed, red: item.priority === 'High', yellow: item.priority === 'Medium', green: item.priority === 'Low'}"  
                        @click="toggleSelectedItem(item)" 
                        @dblclick="toggleUnselectItem">
                        {{ item.item }} 
                    </span>
                    <input 
                        v-model="item.item" 
                        placeholder="Update The List Item" 
                        v-if='itemSelect' 
                        @keyup.enter="saveUpdatedListItemName(item)"
                    />
                    <button 
                            class="btn-delete" 
                            @click="deleteSelectedListItem(item)"
                            >
                            Delete
                    </button>
                    <button 
                            class="btn-edit" 
                            @click="editSelectedItem()" 
                            v-if='!itemSelect'
                            >
                            Edit
                    </button>
                    <button 
                            class="btn-edit" 
                            @click="saveUpdatedListItemName(item)" 
                            v-if='itemSelect'
                            >
                            Save
                    </button>
                </div>          
            </li>
        </ul>

        <p
                class="empty-list"
                v-if="selectedList.items.length === 0"
                > 
                Ohh No, List has no item. Let's add some item 👨‍💻
        </p>
        <button 
                class="btn" 
                id="clear-task"
                @click="clearCompletedListItem" 
                v-else
                >
                Clear Completed Item
        </button>
        <button 
                class="btn" 
                id="back-task" 
                @click="backlistButton"
                >
                Back
        </button>
      
    </div>

    <!--Task list item priority -->
    <div v-if="selectedListItem" class="hide priority">
        <h2 
            class="task-list-title"
            > 
            {{ selectedListItem.item }} 
        </h2>

        <div class="tasks form" id="priority">

            Note: <br> 
            <textarea 
                        id="noteText" 
                        cols="62" 
                        rows="10" 
                        placeholder="Write something" 
                        v-model="selectedListItem.noteText"
                        >
            </textarea><br>

            Date: <br> 
            <input      
                        type="date" 
                        id="date" 
                        v-model="selectedListItem.date"
                        > <br>

            Priority: <br> 
            <select 
                        id="select" 
                        v-model="selectedListItem.priority"
                        >
                        <option 
                                v-for="option in options" 
                                :selected = "selectedListItem.priority === option" 
                                :key='option'
                                >
                                {{ option }}
                        </option>
            </select>
        </div>  
            <button 
                        class="btn" 
                        id="update-task-priority" 
                        @click="updateSelectedListItemPriority"
                        >
                        Update
            </button> 
    </div>
</div>
</template>

<script>
// import TodoListService  from '../TodoListService'
const API_URL = 'http://localhost:5000/lists'
export default {
  name: 'TodoListComponent',
  data() { 
    return {
      newList: '',
      lists: [],
      selectedList: null,
      selectedListItem: null,
      newItem: '',
      options: ['None', 'High', 'Medium', 'Low'],
      noteText: '',
      date: '',
      priority: 'None',
      completed: false,
      itemSelect: false,
      listSelect: false
    }
  },

  mounted() {
    /*
     * ALL Task List Is GET here..
     * http://localhost:5000/lists
    */ 
    fetch(API_URL)
      .then(response => response.json())
      .then(res => this.lists = res)
  },

  computed: {
    searchedLists () {
      return this.lists.slice(0).reverse().filter(list => list.list.match(this.newList))
    },
    // searchedItems () {
    //   return this.selectedList.items.slice(0).reverse().filter(item => item.item.match(this.newItem))
    // },
    sortedItems () {
      if (this.selectedList) {
        const highPriority = []
        const mediumPriority = []
        const lowPriority = []
        const nonePriority = []
        this.selectedList.items.forEach(item => {
          if (item.priority === "High") highPriority.push(item)
          if (item.priority === "Medium") mediumPriority.push(item)
          if (item.priority === "Low") lowPriority.push(item)
          if (item.priority === "None") nonePriority.push(item)
        })
        const highPriority1 = this.filterDate(highPriority)
        const mediumPriority1 = this.filterDate(mediumPriority)
        const lowPriority1 = this.filterDate(lowPriority)
        const nonePriority1 = this.filterDate(nonePriority)
        const concatPrio = highPriority1.concat(mediumPriority1).concat(lowPriority1).concat(nonePriority1)
        return concatPrio.filter(item => item.item.match(this.newItem))
      }
      return []
    },
    
  },
  methods: {

    /*
     * New Task List Is created here..
     * http://localhost:5000/lists
    */   
    saveList() {
      if (this.newList) {
        fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({newList: this.newList}),
        headers: {
          "content-type": "application/json"
        }
      })
        .then(response => response.json())
        .then(() => {
            this.newList = ''
            fetch(API_URL)
            .then(response => response.json())
            .then(res => this.lists = res)
        });
      }
    },
    
    /*
     * Task List Is Selected here for update name..
     * http://localhost:5000/lists
    */ 
    editSelectedList () {
      this.listSelect = !this.listSelect
    },

    /*
     * Task List Name Is Updated here..
     * http://localhost:5000/lists/${list_id}
    */ 
    saveUpdatedListName (list) {
      fetch(API_URL+`/${list.list_id}`, {
        method: "PUT",
        body: JSON.stringify({newList: list.list}),
        headers: {
          "content-type": "application/json"
        }
      })
        .then(response => response.json()).then(() => this.listSelect = !this.listSelect)
    },

    /*
     * New Task List Is Selected here..
     * http://localhost:5000/lists
    */ 
    toggleSelected (list) {
      this.selectedList = list
    },

    /*
    * Task List Item Is Deleted here..
    * http://localhost:5000/lists/${list_id}
    */
    deleteSelectedList(list) {
      fetch(API_URL+`/${list.list_id}`, {
        method: "DELETE"
      })
        .then(response => response.json())
        .then(() => {
          this.lists = this.lists.filter(li => li.list_id !== list.list_id)
        })
    },

    /*
    * New Task List Item Is created here..
    * http://localhost:5000/lists/${list_id}/tasks
    */
    saveListItem() {
      if (this.newItem) {
        fetch(API_URL+`/${this.selectedList.list_id}/tasks`, {
          method: "POST",
          body: JSON.stringify({ newItem: this.newItem, noteText: this.noteText, priority: this.priority, date: this.date, completed: this.completed }),
          headers: {
            "content-type": "application/json"
          }
        })
          .then(response => response.json())
          .then(result => {
            this.selectedList.items.push(result)
            this.newItem = ''
          });
      }
    },

    /*
    * New Task List Item Is Deleted here..
    * http://localhost:5000/lists/${list_id}/tasks/${item_id}
    */
    deleteSelectedListItem(item) {
      fetch(API_URL+`/${this.selectedList.list_id}/tasks/${item.item_id}`, {
        method: "DELETE"
      })
        .then(response => response.json())
        .then(() => {
          this.selectedList.items = this.selectedList.items.filter(it => it.item_id !== item.item_id)
        })
    },
    
    /*
    * New Task List Item Is Selected here..
    * http://localhost:5000/lists/${list_id}/tasks/${item_id}
    */
    toggleSelectedItem (item) {
      this.selectedListItem = item
    },

    /*
    * New Task List Item Priority Is Updated here..
    * http://localhost:5000/lists/${list_id}/tasks/${item_id}
    */
    updateSelectedListItemPriority () {
      fetch(API_URL+`/${this.selectedList.list_id}/tasks/${this.selectedListItem.item_id}`, {
        method: "PUT",
        body: JSON.stringify({ newItem: this.selectedListItem.item, noteText: this.selectedListItem.noteText, priority: this.selectedListItem.priority, date: this.selectedListItem.date, completed: this.selectedListItem.completed }),
        headers: {
          "content-type": "application/json"
        }
        })
          .then(response => response.json())
    }, 
    
    /*
     * Task List Item Is Selected here for update name..
     * http://localhost:5000/lists/${list_id}/tasks/${item_id}
    */       
    editSelectedItem () {
      this.itemSelect = !this.itemSelect
    },

    /*
     * Task List Item Name Is Updated here..
     * http://localhost:5000/lists/${list_id}/tasks/${item_id}
    */ 
    saveUpdatedListItemName(item){
      fetch(API_URL+`/${this.selectedList.list_id}/tasks/${item.item_id}`, {
        method: "PUT",
        body: JSON.stringify({ newItem: item.item, noteText: item.noteText, date: item.date, priority: item.priority, completed: !item.completed}),
        headers: {
          "content-type": "application/json"
        }
       })
         .then(response => response.json()).then(() => this.itemSelect = !this.itemSelect)
    },

    /*
     * Task List Item Is Unselected here..
     * http://localhost:5000/lists/${list_id}/tasks
    */ 
    toggleUnselectItem() {
      this.selectedListItem = null
    },

    /*
     * Task List Item Is Checked here..
     * http://localhost:5000/lists/${list_id}/tasks
    */ 
    markComplete(item) {
      fetch(API_URL+`/${this.selectedList.list_id}/tasks/${item.item_id}`, {
        method: "PUT",
        body: JSON.stringify({ newItem: item.item, noteText: item.noteText, date: item.date, priority: item.priority, completed: !item.completed}),
        headers: {
          "content-type": "application/json"
        }
      })
      .then(response => response.json())
    },

    /*
     * Clear Completed Task List Item Is  here..
     * http://localhost:5000/lists/${list_id}/tasks/${item_id}
    */ 
    clearCompletedListItem () {
      for (let item of this.selectedList.items) {
        if(item.completed) {
          fetch(API_URL+`/${this.selectedList.list_id}/tasks/${item.item_id}`, {
            method: "DELETE"
          })
            .then(response => response.json())
            .then(() => {
              this.selectedList.items = this.selectedList.items.filter(it => it.item_id !== item.item_id)
            })
        }
      }          
    },

    /*
     * Back button for Task List Item here..
     * http://localhost:5000/lists
    */ 
    backlistButton () {
      this.selectedList = null
      this.selectedListItem = null
    },
    
    /*
     * Filtering date..
     * http://localhost:5000/lists
    */
    filterDate(priorityFilter) {
      const noDate = []
      const highAfter = []
      const highBefore = []
      priorityFilter.forEach(item => {
        if (!item.date) noDate.push(item)
        if (item.date && new Date(item.date).toISOString().slice(0, 10) < new Date().toISOString().slice(0, 10)) highBefore.push(item)
        if (item.date && new Date(item.date).toISOString().slice(0, 10) >= new Date().toISOString().slice(0, 10)) highAfter.push(item)
      })
      highBefore.sort((a, b) => new Date(b.date) - new Date(a.date))
      highAfter.sort((a, b) => new Date(a.date) - new Date(b.date))
      return [].concat(highAfter).concat(highBefore).concat(noDate)
    }
    
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
* {
  box-sizing: border-box;
}

body {
  font-size: 15px;
  font-family: "Open Sans", sans-serif;
  color: #273849;
  background-color: #42b983;
  /* background-image: url(back.jpg); */
  background-repeat: no-repeat;
  background-size: cover;
  padding: 50px 20px;
  margin: 0;
  min-height: 100vh;
  position: relative;
}

.header {
  color: #273849;
  text-align: center;
  margin-bottom: 40px;
}

#todo-lists {
  width: 600px;
  max-width: 100%;
  min-height: 100px;
  margin: 20px auto 50px;
  border: 1px solid #42b983;
  border-radius: 4px;
  padding: 40px 20px;
  background-color: #f4f7fc;
  overflow: hidden;
  position: relative;
}

.todo-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.btn,
#new-todo-input {
  line-height: 2em;
  border-radius: 3px;
  border: 0;
  display: inline-block;
  margin: 15px 0;
  padding: 0.2em 1em;
  font-size: 1em;
}
.btn,
.btn-edit,
.btn-delete {
  border-radius: 4px;
  border: 0;
  background-color: #42b983;
  color: #273849;
  cursor: pointer;
}

.btn-edit,
.btn-delete {
  float: right;
}

.btn-delete {
  color: #42b983;
  background-color: #273849;
  margin-left: 20px;
}

#new-todo-input {
  border: 1px solid #42b983;
  min-width: 80%;
}

#back-task {
    margin-left: 35px;
}

li {
  line-height: 1.5;
  display: block;
  margin-top: 1em;
  margin-left: -35px;
  cursor: pointer;
}
li:hover {
  opacity: 0.9;
}

.empty-list {
  padding-top: 10px;
  text-align: center;
  opacity: 0.6;
  font-size: 25px;
  line-height: 1.75;
}

.strikeout {
  text-decoration: line-through;
}

.seletedList {
  opacity: 0.7;
  color: blueviolet;
}

.green {
  background-color: green;
  opacity: 0.7;
  color: white;
  margin-bottom: 5px;
  border-radius: 5px;
}
.green:hover,
.yellow:hover,
.red:hover {
  padding: 1px 1px 1px 1px;
}

.yellow {
  background-color: yellow;
  opacity: 0.7;
  color: black;
  margin-bottom: 5px;
  border-radius: 5px;
}

.red {
  background-color: red;
  opacity: 0.7;
  color: white;
  margin-bottom: 5px;
  border-radius: 5px;
}

#priority {
  width: 600px;
  max-width: 100%;
  min-height: 100px;
  margin: 20px auto 50px;
  border: 1px solid #42b983;
  border-radius: 4px;
  padding: 40px 20px;
  -webkit-box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.05);
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.05);
  background-color: #f4f7fc;
  overflow: hidden;
  position: relative;
}

 select {
    margin-top: 15px;
    border: 1px solid #273849; 
    min-width: 100%;
    cursor: pointer;
  }

  #date {
      margin-top: 10px;
      margin-bottom: 10px;
      border: 1px solid #273849;
      min-width: 100%;
      cursor: pointer;
  }

  #noteText {
     border: 1px solid #273849;
     margin-top: 10px;
      margin-bottom: 10px;
      min-width: 100%;
      cursor: pointer; 
  }
</style>
