<template>
  <div class="flex items-center justify-between gap-3">
    <button class="flex items-center flex-1 h-8 px-2 text-sm font-medium rounded" v-if="isEditing">
      <img src="~/assets/icons/pencil.svg" alt="Delete" class="w-6 h-6 cursor-pointer"/>
      <input class="w-full h-8 ml-3 bg-transparent focus:outline-none font-medium" type="text"
             placeholder="Add a new task" v-model="editedTitle" @keydown.enter="handleUpdateTodo" ref="titleTxtRef">
    </button>

    <div class="flex items-center gap-3 flex-1" v-else>
      <input class="hidden" type="checkbox" :id="id" :checked="todo.is_completed" @change="handleToggleTodoCheckbox">
      <label class="flex items-center h-10 px-2 rounded cursor-pointer hover:bg-gray-100 flex-1" :for="id">
					<span class="flex items-center justify-center w-5 h-5 text-transparent border-2 border-gray-300 rounded-full">
						<svg class="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                 fill="currentColor">
							<path fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"/>
						</svg>
					</span>
        <span class="ml-4 text-sm flex-1">{{ todo.title }}</span>
      </label>
    </div>

    <div class="flex items-center gap-1">
      <IconWrapper @click.native="handleCancelEditMode" v-if="isEditing">
        <img src="~/assets/icons/close.svg" alt="Delete" class="w-6 h-6 cursor-pointer"/>
      </IconWrapper>

      <IconWrapper @click.native="handleOpenEditMode" v-else>
        <img src="~/assets/icons/pencil.svg" alt="Delete" class="w-6 h-6 cursor-pointer"/>
      </IconWrapper>

      <IconWrapper @click.native="handleDeleteTodo">
        <img src="~/assets/icons/trash.svg" alt="Delete" class="w-6 h-6 cursor-pointer"/>
      </IconWrapper>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash/debounce';
import IconWrapper from '~/components/common/IconWrapper.vue';
import Swal from 'sweetalert2';

export default {
  name: 'TodoItem',
  components: { IconWrapper },
  props: {
    /**
     * The todo object
     * @type {{ title: string, id: number, is_completed: boolean }}
     */
    todo: {
      type: Object,
      required: true,
    },
  },
  data: () => {
    return {
      isEditing: false,
      editedTitle: '',
    };
  },
  computed: {
    /**
     * The id of the todo
     * @type {string}
     */
    id() {
      return `task_${this.todo.id}`;
    },
  },
  methods: {
    handleToggleTodoCheckbox(value) {
      const isChecked = value.target.checked;

      if (isChecked === this.todo.is_completed) return;

      // TODO: call api to update todo
      this.$store.dispatch('todo/updateTodoById', {
        id: this.todo.id,
        payload: {
          is_completed: isChecked,
        },
      }).then(() => {
        this.$emit('change-todo-status', {
          id: this.todo.id,
          is_completed: isChecked,
        });
      });
    },
    handleDeleteTodo() {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this todo!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it',
      }).then((result) => {
        if (result.isConfirmed) {
          // call api to delete todo
          this.$store.dispatch('todo/deleteTodoById', this.todo.id).then(() => {
            this.$emit('delete-todo', this.todo.id);
          });
        }
      });
    },
    handleOpenEditMode() {
      this.isEditing = true;
      this.editedTitle = this.todo.title;

      this.$nextTick(() => {
        this.$refs?.titleTxtRef?.focus();
      });
    },
    handleUpdateTodo: debounce(function() {
      if (!this.editedTitle) return;

      // call api to update todo
      this.$store.dispatch('todo/updateTodoById', {
        id: this.todo.id,
        payload: {
          title: this.editedTitle,
        },
      }).then(() => {
        this.$emit('update-todo', {
          id: this.todo.id,
          title: this.editedTitle,
        });
      }).finally(() => {
        this.isEditing = false;
      });
    }, 300),
    handleCancelEditMode() {
      this.isEditing = false;
    },
  },
};
</script>

<style scoped>
input[type=checkbox]:checked + label span:first-of-type {
  background-color: #10B981;
  border-color: #10B981;
  color: #fff;
}

input[type=checkbox]:checked + label span:nth-of-type(2) {
  text-decoration: line-through;
  color: #9CA3AF;
}
</style>
