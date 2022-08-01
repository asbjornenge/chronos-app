import { Typography } from "@mui/material"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Breadcrumbs from '../Breadcrumbs'

export default (props) => {
  let { faIcon, SvgIcon, title, ...other} = props
  let icon = faIcon !== undefined ? <FontAwesomeIcon icon={faIcon} className="TitleIcon"/> : null
  icon = SvgIcon !== undefined ? SvgIcon : icon
  return (
    <div className="top">
        <div className='tophalf'>
          <Breadcrumbs/>
        </div>
        <span className='middle'>
          <Typography variant="h4" gutterBottom component="div">
            {icon}
            {props.title}
          </Typography>
        </span>
        <div className="spacer"></div>
        <span className="TopRightBar">
          {other.children}
        </span>
      </div>
  )
}

