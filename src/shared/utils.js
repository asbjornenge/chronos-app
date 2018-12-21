export function nav(path) {
  window.location.hash = path
}

export function isRestReady(props) {
  return Object.keys(props.data).length > 0 
}

export function getTaskStatus(task) {
  let status = 'passing';
  (task.steps || []).forEach(s => {
    (s.execs || []).forEach(e => {
      if (e.exitcode !== 0) status = 'failing'
    })
  })
  if (task.paused) status = 'paused'
  return status
}

export function setTaskStatus(task) {
  task.status = getTaskStatus(task)
  return task
}
