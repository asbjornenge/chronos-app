import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link'
import { Typography } from '@mui/material';

const isNum = function (str) {
  if (typeof str != "string") return false // we only process strings!  
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

export default (props) => {
  let prev = ""
  let last 
  let i = 0
  let hashes = window.location.hash.split("/")
  if (hashes.length === 1) {hashes = ["#"]}
  let locations = hashes.map(m => {
    prev = prev + "/" + m
    if (m === "" || m === null) return
    if (isNum(m)) return (
      <Link underline="hover" color="inherit" href={prev} key={m}>
        {last.toUpperCase()}
      </Link>
    )
    i ++
    if (hashes.length === i || m === "#") {
      return (
        <Link underline="hover" color="inherit" href={prev} key={m}>
          {m === "#" ? "HOME" : m.toUpperCase()}
      </Link>
      )
    }
    
    last = m
  })
  return (
    <Breadcrumbs aria-label="breadcrumb">
      {locations}
  </Breadcrumbs>
  )
}
