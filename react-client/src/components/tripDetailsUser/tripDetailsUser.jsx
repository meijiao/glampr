import React from 'react';
import $ from 'jquery';
import flickr from './flickrAPI.jsx'

class TripDetailsUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //inputs: false;
      tripInfo: {
        description: 'Kilimanjaro'
      }
    }
    this.getTripDetails = this.getTripDetails.bind(this);
    this.setPhotoState = this.setPhotoState.bind(this);
    this.getTripDescription = this.getTripDescription.bind(this);
  };

  componentDidMount() {

    var context = this;

    // get trip information that maker created
    $.ajax({
      type: "GET",
      url: '/tripDetailsUser',
    }).done(function(data){
      console.log(data);
      context.getTripDetails(data);
      console.log('successful get from terms');
    }).fail(function(){
      console.log('failed to get from terms');
    });

    // get photos from flickr based on trip description
    this.getPhotosfromFlickr();

  }

  getPhotosfromFlickr() {
    var description = this.state.tripInfo.description
    flickr.getAllPhotosAsync(description, this.setPhotoState);
  }

  setPhotoState(results) {
    this.setState({urls: results})
    console.log(this.state, 'this.state in setPhotos');
  }

  getTripDescription() {
    return this.state.tripInfo.description;
  }

  getTripDetails(data) {
    console.log(data, 'data');
    if (data) {
      var tripInfo = {};
      tripInfo.title = data.title;
      var des = data.description || 'Kilimanjaro';
      tripInfo.description = des;
      tripInfo.start_date = data.start_date;
      tripInfo.end_date = data.end_date;
      tripInfo.address = data.address;
      this.setState({tripInfo: tripInfo});
    }
  }

  render() {
    if (!this.state.urls) {
      return (
        <div>
          <TripDetails info={this.state.tripInfo}/>
        </div>
      )
    } else {
      return (
        <div>
          <Photos photos={this.state.urls}/>
          <TripDetails info={this.state.tripInfo}/>
        </div>
      )    
    }
  }
}

let TripDetails = (props) => {
  return (
    <div className="mt-1">
      <h4> Your trip: {props.info.title} </h4>
      <h4> About: {props.info.description} </h4>
      <h4> Start Date: {props.info.start_date} </h4>
      <h4> End Date: {props.info.end_date} </h4>
      <h4> Where: {props.info.address} </h4>
    </div>
  )
}


let Photos = (props) => {

  var first = props.photos[0];
  console.log(first, 'first');
  var rest = props.photos.slice(1);

  console.log(props.photos, 'all photos to display');
  return (
    <div className="row">
      <div className="col-xs-12 banner-container">
        <div className="photobanner">
          <img className="first" src={first} height="320" width="500"/>
          {rest.map(photo => {
           return (<Photo url={photo}/>)
          })}
        </div>

      </div>
    </div>
  )

}

let Photo = (props) => {
  return (
    <div className="single-image" >
    <img src={props.url} height="320" width="500"/>
    </div>
  )
}



export default TripDetailsUser