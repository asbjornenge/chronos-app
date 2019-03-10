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

export async function getSteps(task) {
  return await fetch(`${window.apihost}/tasks/${task.id}/steps`) 
    .then(res => res.json())
}
