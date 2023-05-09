export const state = () => ({
});

export const mutations = {}
export const getters = {}

export const actions = {
  async getTodoList() {
    const response = await this.$axios.get('/todo');

    return response.data.data;
  },
  /**
   *
   * @param {{ title: string }} payload
   * @returns {Promise<void>}
   */
  async createTodo(_, payload) {
    const response = await this.$axios.post('/todo', payload);

    return response.data.data;
  },
  async deleteTodoById(_, id) {
    const response = await this.$axios.delete(`/todo/${id}`);

    return response.data.data;
  },
  /**
   *
   * @param _
   * @param id
   * @param {{ title?: string, is_completed?: boolean }} payload
   * @returns {Promise<*>}
   */
  async updateTodoById(_, { id, payload }) {
    const response = await this.$axios.put(`/todo/${id}`, payload);

    return response.data.data;
  }
}
