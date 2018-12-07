const SET_DASHBOARD_FILTER = 'SET_DASHBOARD_FILTER'

const initialState = {
  dashboardFilter: '',
  dashboardNameFilter: ''
}

export default function dashboardApp(state = initialState, action) {
  switch (action.type) {
    case SET_DASHBOARD_FILTER:
      return Object.assign({}, state, {
        dashboardFilter: action.filter
      })
    default:
      return state
  }
}

