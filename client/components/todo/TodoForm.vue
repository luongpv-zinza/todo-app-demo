<template>
  <ValidationObserver v-slot="{ handleSubmit }" slim ref="observer">
    <form @submit.prevent="handleSubmit(handleCreateTodo)">
      <ValidationProvider tag="div" class="flex items-center w-full h-8 px-2 mt-2 text-sm font-medium rounded" rules="required|max:1000" name="title" v-slot="{ errors }">
        <svg class="w-5 h-5 text-gray-400 fill-current" xmlns="http://www.w3.org/2000/svg" fill="none"
             viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
        </svg>
        <div class="flex-grow flex flex-col gap-1 h-8 ml-4 mt-3 font-medium">
          <input type="text"
                 class="bg-transparent focus:outline-none title-txt"
                 placeholder="Add a new task"
                 v-model="title"
          >
          <div class="text-red-500 error-msg" v-if="errors.length">
            {{ errors[0] }}
          </div>
        </div>
      </ValidationProvider>
    </form>
  </ValidationObserver>
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate';

export default {
  name: 'TodoForm',
  components: {
    ValidationObserver,
    ValidationProvider,
  },
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

        // clear validation error
        this.$refs.observer.reset();
      });
    },
  },
};
</script>

<style scoped>
</style>
