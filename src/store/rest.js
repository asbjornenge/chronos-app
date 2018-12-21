import reduxApi, {transformers} from 'redux-api'
//import adapterFetch from 'redux-api/lib/adapters/fetch'

export default reduxApi({
  dashboard: `/dashboard`,
  task: `/tasks/:id`,
  tasks: `/tasks`,
  steps: `/tasks/:task/steps`,
  regions: {
    url: `/api/v1/regions`,
    transformer: transformers.array,
    options: {
      headers: {
        'Accept': 'application/json'
      }
    }
  }
}).use('fetch', adapterFetch)

async function adapterFetch(url, options) {
  return await fetch(`${window.apihost}${url}`, options).then(res => res.json())
}
