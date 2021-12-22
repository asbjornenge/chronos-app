window.apihost = window.location.hostname === 'localhost' ? `http://${window.location.hostname}:3001` : './api'

export async function getTask(id, params='') {
  return await fetch(`${window.apihost}/tasks/${id}${params}`) 
    .then(res => res.json())
}

export async function saveTask(task) {
  if (task.id === 0) return await addTask(task)  
  else return await updateTask(task)
}

export async function addTask(task) {
  delete task.id
  return await fetch(`${window.apihost}/tasks`, 
    { 
      method: 'POST', 
      body: JSON.stringify(task) 
    })
    .then(res => res.json())
}

export async function runTask(task) {
  return await fetch(`${window.apihost}/run/${task.id}`, 
  { 
    method: 'GET', 
  })
}

export async function runStep(step) {
  return await fetch(`${window.apihost}/run/${step.task}/steps/${step.id}`, 
  { 
    method: 'GET', 
  })
}

export async function updateTask(task) {
  return await fetch(`${window.apihost}/tasks/${task.id}`, 
    { 
      method: 'PUT',
      body: JSON.stringify(task) 
    })
    .then(res => res.json())
}

export async function removeTask(task) {
  return await fetch(`${window.apihost}/tasks/${task.id}`, 
    { 
      method: 'DELETE'
    })
    .then(res => res.json())
}

export async function toggleTaskPause(task) {
  return await fetch(`${window.apihost}/tasks/${task.id}`, 
    { 
      method: 'PUT', 
      body: JSON.stringify({ paused: !task.paused}) 
    })
}

export async function saveStep(step, task) {
  if (step.id === 0) return await addStep(step, task)  
  else return await updateStep(step, task)
}

export async function addStep(step, task) {
  delete step.id
  return await fetch(`${window.apihost}/tasks/${task.id}/steps`, 
    { 
      method: 'POST', 
      body: JSON.stringify(step) 
    })
    .then(res => res.json())
}

export async function updateStep(step, task) {
  return await fetch(`${window.apihost}/tasks/${task.id}/steps/${step.id}`, 
    { 
      method: 'PUT',
      body: JSON.stringify(step)
    })
    .then(res => res.json())
}

export async function removeStep(step, task) {
  return await fetch(`${window.apihost}/tasks/${task.id}/steps/${step.id}`, 
    { 
      method: 'DELETE'
    })
    .then(res => res.json())
}
