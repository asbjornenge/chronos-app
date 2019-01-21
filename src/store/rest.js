import reduxApi from 'redux-api'

export default reduxApi({
  dashboard: `/dashboard`,
  task: {
    url: `/tasks/:id`,
    crud: true
  },
  tasks: {
    url: `/tasks`,
    crud: true
  },
  step: {
    url: `/tasks/:task/steps/:id`,
    crud: true
  },
  steps: {
    url: `/tasks/:task/steps`,
    crud: true
  },
  execs: `/tasks/:task/steps/:step/execs`,
}).use('fetch', adapterFetch)

async function adapterFetch(url, options) {
  return await fetch(`${window.apihost}${url}`, options).then(res => res.json())
}
