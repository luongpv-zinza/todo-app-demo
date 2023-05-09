<template>
  <div class="w-screen h-screen font-medium">
    <div class="flex flex-grow items-center justify-center h-full text-gray-600 bg-gray-100">
      <!-- Component Start -->
      <div class="max-w-full p-8 mx-2 bg-white rounded-lg shadow-lg w-full sm:w-1/2">
        <div class="flex items-center mb-3 sm:mb-6">
          <svg class="h-8 w-8 text-indigo-500 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none"
               viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
          </svg>
          <h4 class="font-semibold ml-3 text-lg">Todo List</h4>
        </div>

        <template v-for="todo in list">
          <TodoItem
            :key="todo.id"
            :todo="todo"
            @change-todo-status="handleChangeTodoStatus"
            @delete-todo="handleRemoveTodoById"
            @update-todo="handleUpdateTodoTitle"
          />
        </template>

        <TodoForm @new-todo-created="handlePushNewTodoIntoList"/>
      </div>
      <!-- Component End  -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'TodoList',
  data: () => {
    return {
      list: []
    }
  },
  async beforeCreate() {
    // TODO: call API to get list
    this.list = await this.$store.dispatch('todo/getTodoList');
  },
  methods: {
    handleChangeTodoStatus({ id, is_completed }) {
      const index = this.list.findIndex((item) => item.id === id);

      this.$set(this.list, index, {
        ...this.list[index],
        is_completed
      });
    },
    handlePushNewTodoIntoList(newTodo) {
      this.list.push(newTodo);
    },
    handleRemoveTodoById(todoId) {
      const todoIndex = this.list.findIndex((todo) => todo.id === todoId);

      this.list.splice(todoIndex, 1);
    },
    handleUpdateTodoTitle({ id, title }) {
      const index = this.list.findIndex((item) => item.id === id);

      this.$set(this.list, index, {
        ...this.list[index],
        title
      });
    }
  }
};
</script>
