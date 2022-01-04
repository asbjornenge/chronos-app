import { toast } from 'react-toastify';

window.apihost = window.location.hostname === 'localhost' ? `http://${window.location.hostname}:3001` : './api'

export async function getTask(id, params='') {
  return await fetch(`${window.apihost}/tasks/${id}${params}`) 
    .then(res => res.json())
}

export async function saveTask(task) {
  if (task.id === 0) return await addTask(task)  
  else return await updateTask(task)
}

export async function saveSecret(secret) {
  if (secret.id === -1) return await addSecret(secret)
  else return await updateSecret(secret)
}

export async function addSecret(secret) {
  delete secret.id
  return await toast.promise(fetch(`${window.apihost}/secrets`,
  {
    method: 'POST',
    body: JSON.stringify(secret)
  }).then(res => res.json()),
  {
    pending: "Adding secret...",
    success: "Added secret!",
    error: "Failed to add secret!"
  })
}

export async function updateSecret(secret) {
  if (secret.secretvalue === "UNCHANGED") delete secret.secretvalue
  console.log("Secret", secret)
  return await toast.promise(fetch(`${window.apihost}/secrets/${secret.id}`, 
    { 
      method: 'PUT',
      body: JSON.stringify(secret) 
    })
    .then(res => res.json()), 
    {
      pending: "Updating secret...",
      success: "Updated secret!",
      error: "Failed to update secret!"
    })
}

export async function removeSecret(secret) {
  return await toast.promise(fetch(`${window.apihost}/secrets/${secret.id}`, 
    { 
      method: 'DELETE'
    })
    .then(res => res.json()),
    {
      pending: "Deleting secret...",
      success: "Deleted secret!",
      error: "Failed to delete secret!"
    })
}


export async function addTask(task) {
  delete task.id
  return await toast.promise(fetch(`${window.apihost}/tasks`, 
  {
    method: 'POST',
    body: JSON.stringify(task)
  }).then(res => res.json()), 
  {
    pending: "Adding task...",
    success: "Added task!",
    error: "Failed to add task!"
  })
}

export async function runTask(task) {
  var date = Date.now()
  try {
    return await fetch(`${window.apihost}/run/${task.id}`, 
    { 
      method: 'GET', 
    })
  }
  catch (err) {
    var timeout = 0
    task.steps.forEach(element => {
      timeout += element.timeout
    });
    while (Date.now() < date + timeout) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
    return true
  }
}

export async function runStep(step) {
  var date = Date.now()
  try {
    var result =  await fetch(`${window.apihost}/run/${step.task}/steps/${step.id}`, 
  { 
    method: 'GET', 
  })
  }
  catch (err) {
    while( Date.now() < date + step.timeout) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
    return true
  }
  return result
}

export async function getSecret() {
  return await fetch(`${window.apihost}/secrets`) 
    .then(res => res.json())
}

export async function updateTask(task) {
  return await toast.promise(fetch(`${window.apihost}/tasks/${task.id}`, 
    { 
      method: 'PUT',
      body: JSON.stringify(task) 
    })
    .then(res => res.json()), 
    {
      pending: "Updating task...",
      success: "Updated task!",
      error: "Failed to update task!"
    })
}

export async function removeTask(task) {
  return await toast.promise(fetch(`${window.apihost}/tasks/${task.id}`, 
    { 
      method: 'DELETE'
    })
    .then(res => res.json()),
    {
      pending: "Deleting task...",
      success: "Deleted task!",
      error: "Failed to delete task!"
    })
}

export async function toggleTaskPause(task) {
  return await toast.promise(fetch(`${window.apihost}/tasks/${task.id}`, 
    { 
      method: 'PUT', 
      body: JSON.stringify({ paused: !task.paused}) 
    }),
    {
      pending: task.paused ? "Enabling task...": "Pausing task...",
      success: task.paused ? "Task enabled!" : "Task paused!",
      error: task.paused ? "Failed to enable task!": "Failed to pause task!"
    })
}

export async function saveStep(step, task) {
  if (step.id === 0) return await addStep(step, task)  
  else return await updateStep(step, task)
}

export async function addStep(step, task) {
  delete step.id
  return await toast.promise(fetch(`${window.apihost}/tasks/${task.id}/steps`, 
    { 
      method: 'POST', 
      body: JSON.stringify(step) 
    })
    .then(res => res.json()),
    {
      pending: "Adding step...",
      success: "Step added!",
      error: "Failed to add step!"
    })   
}

export async function updateStep(step, task) {
  return await toast.promise(fetch(`${window.apihost}/tasks/${task.id}/steps/${step.id}`, 
    { 
      method: 'PUT',
      body: JSON.stringify(step)
    })
    .then(res => res.json()),
    {
      pending: "Updating step...",
      success: "Step updated!",
      error: "Failed to update step!"
    })
}

export async function removeStep(step, task) {
  return await toast.promise(fetch(`${window.apihost}/tasks/${task.id}/steps/${step.id}`, 
    { 
      method: 'DELETE'
    })
    .then(res => res.json()),
    {
      pending: "Deleting step...",
      success: "Step deleted!",
      error: "Failed to delete step!"
    })
}
