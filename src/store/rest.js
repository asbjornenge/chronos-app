import reduxApi from 'redux-api'

export default reduxApi({
  dashboard: `/dashboard`,
  task: `/tasks/:id`,
  tasks: `/tasks`,
  steps: `/tasks/:task/steps`,
  execs: `/tasks/:task/steps/:step/execs`,
}).use('fetch', adapterFetch)

async function adapterFetch(url, options) {
  return await fetch(`${window.apihost}${url}`, options).then(res => res.json())
}
