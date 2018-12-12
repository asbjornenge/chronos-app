export const SET_DASHBOARD_FILTER = 'SET_DASHBOARD_FILTER'
export const SET_DASHBOARD_NAME_FILTER = 'SET_DASHBOARD_NAME_FILTER'

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
    case SET_DASHBOARD_NAME_FILTER:
      return Object.assign({}, state, {
        dashboardNameFilter: action.filter
      })
    default:
      return state
  }
}

