<template>
  <div id="app">
     <div class="header">
        <h1 class="title">ToDo App: Vue.js, Redis & ExpressJs</h1>
    </div>
    <TodoListComponent />
  </div>
</template>

<script>
import TodoListComponent from './components/TodoListComponent.vue'

export default {
  name: 'App',
  components: {
    TodoListComponent
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
.header {
  text-align: center
}
</style>
