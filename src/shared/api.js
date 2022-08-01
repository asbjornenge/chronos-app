import { toast } from 'react-toastify';

window.apihost = window.location.hostname === 'localhost' ? `http://${window.location.hostname}:3001` : './api'
window.socketHost = window.location.hostname === 'localhost' ? `http://${window.location.hostname}:3001` : `https://${window.location.hostname}`
window.socketPath = window.location.hostname === 'localhost' ? `/socket.io` : '/api/socket.io'

export async function getTask(id, params='') {
  return await fetch(`${window.apihost}/tasks/${id}${params}`, {credentials: 'include'}) 
    .then(res => res.json())
}

export async function getProfile() {
  return await fetch(`${window.apihost}/profile`, {credentials: 'include'}) 
    .then(res => res.json())
}

export async function getFailedExecs() {
  return await fetch(`${window.apihost}/execs/failed`, {credentials: 'include'}) 
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

export async function getExecs(task, step) {
  return await fetch(`${window.apihost}/tasks/${task.id}/steps/${step.id}/execs`, {credentials: "include"})
    .then(res => res.json())
}

export async function getTaskDashboard(task) {
  return await fetch(`${window.apihost}/dashboard/task/${task}`, {credentials: "include"})
    .then(res => res.json())
}

export async function getSteps(task) {
  return await fetch(`${window.apihost}/tasks/${task.id}/steps`)
}

export async function addSecret(secret) {
  delete secret.id
  return await toast.promise(fetch(`${window.apihost}/secrets`,
  {
    method: 'POST',
    body: JSON.stringify(secret),
    credentials: 'include'
  }).then(res => {
    if (res.ok) {
      return res.json()
    }
    else {
      throw new Error(`Unable to add ${secret.name}`)
    }
  }).catch(err => this.reject(err.message)), 
  {
    pending: "Adding secret...",
    success: "Added secret!",
    error: "Failed to add secret!"
  }).catch(err => err)
}

export async function updateSecret(secret) {
  if (secret.secretvalue === "UNCHANGED") delete secret.secretvalue
  return await toast.promise(fetch(`${window.apihost}/secrets/${secret.id}`, 
    { 
      method: 'PUT',
      body: JSON.stringify(secret),
      credentials: 'include'
    })
    .then(res => {
      if (res.ok) {
        return res.json()
      }
      else {
        throw new Error(`Unable to update ${secret.name}`)
      }
    }).catch(err => this.reject(err.message)), 
    {
      pending: "Updating secret...",
      success: "Updated secret!",
      error: "Failed to update secret!"
    }).catch(err => err)
}

export async function removeSecret(secret) {
  return await toast.promise(fetch(`${window.apihost}/secrets/${secret.id}`, 
    { 
      method: 'DELETE',
      credentials: 'include'
    })
    .then(res => {
      if (res.ok) {
        return res.json()
      }
      else {
        throw new Error(`Unable to delete ${secret.name}`)
      }
    }).catch(err => this.reject(err.message)), 
    {
      pending: "Deleting secret...",
      success: "Deleted secret!",
      error: "Failed to delete secret!"
    }).catch(err => err)
}

export async function addTask(task) {
  delete task.id
  return await toast.promise(fetch(`${window.apihost}/tasks`, 
  {
    method: 'POST',
    body: JSON.stringify(task),
    credentials: 'include'
  }).then(res => {
    if (res.ok) {
      return res.json()
    }
    else {
      throw new Error(`Unable to add ${task.name}`)
    }
  }).catch(err => this.reject(err.message)), 
  {
    pending: "Adding task...",
    success: "Added task!",
    error: "Failed to add task!"
  }).catch(err => err)
}

export async function runTask(task) {
  var date = Date.now()
  try {
    return await fetch(`${window.apihost}/run/${task.id}`, 
    { 
      method: 'GET', 
      credentials: 'include'
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
    credentials: 'include'
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
  return await fetch(`${window.apihost}/secrets`, {credentials: 'include'}) 
    .then(res => res.json())
}

export async function getFiles() {
  return await fetch(`${window.apihost}/files`,{credentials: 'include'}) 
    .then(res => res.json())
}

export async function uploadFile(files) {
  const filePromises = files.map((file) => {
    // Return a promise per file
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          // Resolve the promise with the response value
          let response = await toast.promise(
            fetch(`${window.apihost}/files/${encodeURI(file.name)}`, 
            {
              method: 'POST',
              body: reader.result,
              credentials: 'include'
            })
              .then(res => {
                if (res.ok) {
                  return res.json()
                }
                else {
                  throw new Error("Failed to fetch")
                }
              })
              .catch(error => this.reject(error)),
            {
              pending: `Uploading ${file.name}...`,
              success: `Uploaded ${file.name}!`,
              error: `Failed to upload ${file.name}`              
            }
          ).catch(error => reject(error))
          resolve(response);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsArrayBuffer(file);
    });
  });
  // Wait for all promises to be resolved
  const returnfiles = await Promise.all(filePromises).catch(err => console.error(err));
  return returnfiles
}

export async function deleteFile(file) {
  let escaped = encodeURI(file)
  return await toast.promise(fetch(`${window.apihost}/files/${escaped}`, 
    { 
      method: 'DELETE',
      credentials:'include',
    })
    .then(res => {
      if (res.ok) {
        return res.json()
      }
      else {
        throw new Error(`Unable to delete ${file}`)
      }
    }).catch(err => this.reject(err.message)), 
    {
      pending: "Deleting file...",
      success: "Deleted file!",
      error: "Failed to delete file!"
    }).catch(err => err)
}

export async function updateTask(task) {
  return await toast.promise(fetch(`${window.apihost}/tasks/${task.id}`, 
    { 
      method: 'PUT',
      body: JSON.stringify(task),
      credentials: 'include'
    })
    .then(res => {
      if (res.ok) {
        return res.json()
      }
      else {
        throw new Error(`Unable to update ${task.name}`)
      }
    }).catch(err => this.reject(err.message)), 
    {
      pending: "Updating task...",
      success: "Updated task!",
      error: "Failed to update task!"
    }).catch(err => err)
}

export async function removeTask(task) {
  return await toast.promise(fetch(`${window.apihost}/tasks/${task.id}`, 
    { 
      method: 'DELETE',
      credentials:'include'
    })
    .then(res => {
      if (res.ok) {
        return res.json()
      }
      else {
        throw new Error(`Unable to delete ${task.name}`)
      }
    }).catch(err => this.reject(err.message)), 
    {
      pending: "Deleting task...",
      success: "Deleted task!",
      error: "Failed to delete task!"
    }).catch(err => err)
}

export async function toggleTaskPause(task) {
  return await toast.promise(fetch(`${window.apihost}/tasks/${task.id}`, 
    { 
      method: 'PUT', 
      body: JSON.stringify({ paused: !task.paused}),
      credentials: 'include'
    }).then(res => {
      if (res.ok) {
        return res
      }
      else {
        throw new Error(`Unable to toggle ${task.name}`)
      }
    }).catch(err => this.reject(err.message)), 
    {
      pending: task.paused ? "Enabling task...": "Pausing task...",
      success: task.paused ? "Task enabled!" : "Task paused!",
      error: task.paused ? "Failed to enable task!": "Failed to pause task!"
    }).catch(err => err)
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
      body: JSON.stringify(step),
      credentials: 'include'
    })
    .then(res => {
      if (res.ok) {
        return res.json()
      }
      else {
        throw new Error(`Unable to add ${step.name}`)
      }
    }).catch(err => this.reject(err.message)), 
    {
      pending: "Adding step...",
      success: "Step added!",
      error: "Failed to add step!"
    }).catch(err => err)
}

export async function updateStep(step, task) {
  return await toast.promise(fetch(`${window.apihost}/tasks/${task.id}/steps/${step.id}`, 
    { 
      method: 'PUT',
      body: JSON.stringify(step),
      credentials:'include'
    }).then(res => {
      if (res.ok) {
        return res.json()
      }
      else {
        throw new Error(`Unable to update ${step.name}`)
      }
    }).catch(err => this.reject(err.message)), 
    {
      pending: "Updating step...",
      success: "Step updated!",
      error: "Failed to update step!"
    }).catch(err => err)
}

export async function removeStep(step, task) {
  return await toast.promise(fetch(`${window.apihost}/tasks/${task.id}/steps/${step.id}`, 
    { 
      method: 'DELETE',
      credentials: 'include'
    })
    .then(res => {
      if (res.ok) {
        return res.json()
      }
      else {
        throw new Error(`Unable to delete ${step.name}`)
      }
    }).catch(err => this.reject(err.message)), 
    {
      pending: "Deleting step...",
      success: "Step deleted!",
      error: "Failed to delete step!"
    }).catch(err => err)
}
