<template>
  <button class="flex items-center w-full h-8 px-2 mt-2 text-sm font-medium rounded">
    <svg class="w-5 h-5 text-gray-400 fill-current" xmlns="http://www.w3.org/2000/svg" fill="none"
         viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
    </svg>
    <input class="flex-grow h-8 ml-4 bg-transparent focus:outline-none font-medium" type="text"
           placeholder="Add a new task" v-model="title" @keydown.enter="handleCreateTodo">
  </button>
</template>

<script>
export default {
  name: 'TodoForm',
  data: () => {
    return {
      title: '',
      isCreating: false,
    };
  },
  methods: {
    async handleCreateTodo() {
      if (this.isCreating || this.title.trim() === '') return;

      this.isCreating = true;

      // call API to create todo
      this.$store.dispatch('todo/createTodo', {
        title: this.title,
      }).then(newTodo => {
        this.$emit('new-todo-created', newTodo);
      }).finally(() => {
        this.isCreating = false;
        this.title = '';
      });
    },
  },
};
</script>

<style scoped>

</style>
