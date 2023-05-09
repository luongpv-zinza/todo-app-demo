import { mount, shallowMount, createLocalVue } from '@vue/test-utils'

import Vuex from 'vuex'
import flushPromises from 'flush-promises'
import TodoList from '@/components/todo/TodoList.vue'
import TodoForm from '@/components/todo/TodoForm.vue'
import TodoItem from '@/components/todo/TodoItem.vue'

const localVue = createLocalVue()
const fakeTodo = {
  id: 1,
  title: 'Fake todo 1',
  is_completed: false,
  date: null
};
localVue.use(Vuex)

describe('TodoForm', () => {
  test('can render', async () => {
    const wrapper = mount(TodoForm)

    expect(wrapper.find(`input[placeholder="Add a new task"]`).exists()).toBe(true)
  });
})

describe('TodoList', () => {
  test('can render', async () => {
    const store = new Vuex.Store({
      modules: {
        todo: {
          actions: {
            'todo/getTodoList': async () => {
              return [{
                id: 1,
                title: 'Fake todo 1',
                is_completed: false,
                date: null
              }]
            }
          }
        }
      }
    });

    const wrapper = shallowMount(TodoList, {
      components: {
        TodoForm,
        TodoItem
      }, store, localVue
    });

    expect(wrapper.text()).toContain('Todo List')
  })

  test('can getData from api and render correct', async () => {
    const store = new Vuex.Store({
      modules: {
        todo: {
          actions: {
            'todo/getTodoList': async () => {
              return [fakeTodo]
            }
          }
        }
      }
    });

    const wrapper = mount(TodoList, {
      components: {
        TodoForm,
        TodoItem
      },
      store,
      localVue
    });

    await flushPromises();
    expect(wrapper.text()).toContain(fakeTodo.title)
  })
})

describe('TodoItem', () => {
  test('can render if parsing correct props', () => {
    const wrapper = shallowMount(TodoItem, {
      propsData: {
        todo: fakeTodo
      }
    })

    expect(wrapper.text()).toContain(fakeTodo.title)
    // test if has 2 buttons
    expect(wrapper.find('img[alt="Edit"]').exists()).toBe(true)
    expect(wrapper.find('img[alt="Delete"]').exists()).toBe(true)
  })
})
