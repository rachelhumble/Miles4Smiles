import React, {Component} from "react"

class Location extends Component{
  state={};
  
  componentDidMount(){
  navigator.geolocation.getCurrentPosition ((position) => {
    console.log("Latitude: ", position.coords.latitude);
    console.log("Longitude: ", position.coords.longitude)
    console.log(position)
  },
  (error)=>{
    console.log("ErrorCode :" + error.code +"Error Message"+ error.message)
  })
}
render() {
  return(
   <p>Temporary message just so you know Location is in console now</p>
  )
}
}

export default Location;