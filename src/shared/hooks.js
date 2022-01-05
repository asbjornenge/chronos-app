import { useEffect } from 'react'
import { useStore } from 'react-hookstore'
import * as api from './api'

const useTasks = () => {
  let [tasks, setTasks] = useStore('tasks')
  
  async function fetchTasks() {
    if (tasks.length > 0) return
    let _tasks = tasks.slice()
    _tasks.loading = true
    setTasks(_tasks)
    _tasks = await fetch(`${window.apihost}/dashboard`)
      .then(res => res.json())
      .catch(e => { tasks.error = e.message; return tasks })
    _tasks.loading = false
    setTasks(_tasks)
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  return [tasks, setTasks]
}

const useSecrets = () => {
  let [secrets, setSecrets] = useStore('secrets')

  async function fetchSecrets() {
    if (secrets.length > 0) return
    let _secrets = secrets.slice()
    _secrets.loading = true
    setSecrets(_secrets)
    _secrets = await api.getSecret().catch(e => { secrets.error = e.message; return secrets})
    _secrets.loading = false
    setSecrets(_secrets)
  }

  useEffect(() => {
    fetchSecrets()
  }, [])

  return [secrets, setSecrets]
}

const useFiles = () => {
  let [files, setFiles] = useStore('files')

  async function fetchFiles() {
    if (files.length > 0) return
    let _files = files.slice()
    _files.loading = true
    setFiles(_files)
    _files = await api.getFiles().catch(e => {files.error = e.message; return files})
    _files.loading = false
    setFiles(_files)
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  return [files, setFiles]
}

export {
  useTasks,
  useSecrets,
  useFiles
}