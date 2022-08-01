export function nav(path) {
  window.location.hash = path
}

export function isRestReady(props) {
  return Object.keys(props.data).length > 0 
}

export function setTaskStatus(task) {
  task.status = getTaskStatus(task)
  return task
  }

export function getTaskStatus(task) {
  let status = 'passing';
  if (!!task?.steps[0]?.execs) {
    (task.steps || []).forEach(s => {
      let lastExec = getLastExec(s)
      if (!lastExec) return
      if (lastExec.exitcode !== 0) status = 'failing'
      if (!lastExec?.completed) status = 'run'
    })
  }
  else {
    if (task.exitcode?.filter(e => e === null).length !== 0) status = "run"
    if (task.exitcode?.length >= 1 && task.exitcode.filter(e => e !== 0 && e !== null).length >= 1) status = "failing"
  }
  if (task.paused) status = 'paused'
  return status
}

export function getStepStatus(step) {
  let status = 'passing';
  let lastExec = getLastExec(step)
  if (lastExec && lastExec.exitcode !== 0) status = 'failing'
  if (!lastExec?.completed && step.execs.length >= 1) status = "run"
  return status
}

export function getLastExec(step) {
  return step.execs.reduce((last, e) => {
    if (last === null) return e
    if (e.time_start > last.time_start) return e
    return last
  },null) 
}
