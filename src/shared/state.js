import { createStore } from 'react-hookstore'

createStore('textFilter', '')
createStore('statusFilter', '')
createStore('tasks', [])
createStore('secrets', [])
createStore('files', [])
createStore('profile', {})