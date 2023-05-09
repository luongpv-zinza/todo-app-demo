import { mount, shallowMount, createLocalVue } from '@vue/test-utils'

import Vuex from 'vuex'
import flushPromises from 'flush-promises'
import TodoList from '~/components/todo/TodoList.vue'
import TodoForm from '~/components/todo/TodoForm.vue'
import TodoItem from '~/components/todo/TodoItem.vue'
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import { extend } from 'vee-validate';
import { required, max } from 'vee-validate/dist/rules.umd'
import { messages } from 'vee-validate/dist/locale/en.json';
import Swal from 'sweetalert2';

extend('required', {
  ...required,
  message: messages['required']
})

extend('max', {
  ...max,
  message: messages['max']
})

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

  test('show error if enter empty todo title', async () => {
    const wrapper = mount(TodoForm, {
      components: {
        ValidationObserver,
        ValidationProvider
      }
    })

    const input = wrapper.find('.title-txt');
    input.setValue('');

    await input.trigger('keydown.enter');
    await flushPromises();

    expect(wrapper.find('.error-msg').exists()).toBe(true);
    expect(wrapper.find('.error-msg').text()).toBe('The title field is required');
  });

  test('show error if enter todo title more than 1000 characters', async () => {
    const wrapper = mount(TodoForm, {
      components: {
        ValidationObserver,
        ValidationProvider
      }
    })

    const input = wrapper.find('.title-txt');
    const invalidStr = new Array(1100).join('a');
    input.setValue(invalidStr);

    await input.trigger('keydown.enter');
    await flushPromises();

    expect(wrapper.find('.error-msg').exists()).toBe(true);
    expect(wrapper.find('.error-msg').text()).toBe('The title field may not be greater than 1000 characters');
  })
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

  test('can change todo status', async () => {
    const store = new Vuex.Store({
      modules: {
        todo: {
          actions: {
            'todo/getTodoList': async () => {
              return [fakeTodo]
            },
            'todo/updateTodoById': async () => {
              return Promise.resolve(); // fake success
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

    const inputCheckbox = wrapper.find(`#task_${fakeTodo.id}`);
    await inputCheckbox.trigger('click');

    await flushPromises();

    // check if inputCheckbox is checked
    expect(inputCheckbox.element.checked).toBe(true);
  })

  test('can delete todo', async () => {
    const store = new Vuex.Store({
      modules: {
        todo: {
          actions: {
            'todo/getTodoList': async () => {
              return [fakeTodo]
            },
            'todo/deleteTodoById': async () => {
              return Promise.resolve(); // fake success
            }
          }
        }
      },
    });

    const wrapper = mount(TodoList, {
      components: {
        TodoForm,
        TodoItem
      },
      store,
      localVue,
      mocks: {
        $swal: {
          fire: jest.fn().mockResolvedValue({ isConfirmed: true })
        }
      }
    });

    await flushPromises();

    const deleteBtn = wrapper.find(`img[data-id="delete_btn_${fakeTodo.id}"]`);
    await deleteBtn.trigger('click');
    await flushPromises();

    expect(wrapper.text()).not.toContain(fakeTodo.title);
  })

  test('can edit todo', async () => {
    const store = new Vuex.Store({
      modules: {
        todo: {
          actions: {
            'todo/getTodoList': async () => {
              return [fakeTodo]
            },
            'todo/updateTodoById': async () => {
              return Promise.resolve(); // fake success
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
    const newTitle = 'New title';

    await flushPromises();

    const editIcon = wrapper.find(`img[data-id="edit_btn_${fakeTodo.id}"]`);
    await editIcon.trigger('click');

    await flushPromises();

    const titleInput = wrapper.find(`input[data-id="title_input_${fakeTodo.id}"]`);
    titleInput.setValue(newTitle);
    titleInput.trigger('click');
    titleInput.trigger('keydown.enter');

    await wrapper.vm.$nextTick();
    await flushPromises();

    await (() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          try {
            expect(wrapper.text()).toContain(newTitle);

            // expect item in list was changed
            expect(wrapper.vm.$data.list[0].title).toBe(newTitle);
          } catch (e) {
            throw e;
          } finally {
            resolve();
          }
        }, 300);
      })
    })()


    // const inputCheckbox = wrapper.find(`#task_${fakeTodo.id}`);
    // await inputCheckbox.trigger('click');
    //
    // await flushPromises();
    //
    // // check if inputCheckbox is checked
    // expect(inputCheckbox.element.checked).toBe(true);
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
