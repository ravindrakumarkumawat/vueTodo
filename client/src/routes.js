import TodoListComponent from './components/TodoListComponent.vue'

export const routes = [
  {
    path: '/lists',
    component: TodoListComponent
  },
  {
    path: '',
    redirect: '/lists'
  }
]
