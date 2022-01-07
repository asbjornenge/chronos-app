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
    _tasks = await fetch(`${window.apihost}/dashboard`, {credentials: 'include'})
      .then(res => res.status === 401 ? window.location = `${window.apihost}/login` : res.json()).catch(e => { tasks.error = e.message; return tasks })
    
    try {
      _tasks.loading = false
      setTasks(_tasks)
    }
    catch (err) {
      tasks.error = "Something went wrong"
      return tasks      
    }

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

const useProfile = () => {
  let [profile, setProfile] = useStore('profile')
  async function fetchProfile() {
    if (profile.length > 0) return
    let _profile = await api.getProfile().catch(e => console.error(e) )
    setProfile(_profile)
  }

  useEffect(() => {
    fetchProfile()
  }, [])
  return [profile, setProfile]
}

export {
  useTasks,
  useSecrets,
  useFiles,
  useProfile
}