import reduxApi, {transformers} from 'redux-api'
import adapterFetch from 'redux-api/lib/adapters/fetch'

export default reduxApi({
  entry: `/api/v1/entry/:id`,
  regions: {
    url: `/api/v1/regions`,
    transformer: transformers.array,
    options: {
      headers: {
        'Accept': 'application/json'
      }
    }
  }
}).use('fetch', adapterFetch(fetch))
