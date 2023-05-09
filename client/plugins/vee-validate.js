import { extend } from 'vee-validate';
import { required, max } from 'vee-validate/dist/rules.umd'
import { messages } from 'vee-validate/dist/locale/en.json';

extend('required', {
  ...required,
  message: messages['required']
})

extend('max', {
  ...max,
  message: messages['max']
})
