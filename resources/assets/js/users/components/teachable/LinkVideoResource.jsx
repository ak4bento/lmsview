import React,  { Component }  from 'react';

class LinkVideoResource extends Component {
  constructor(props) {
    super(props);
  }

  render (){
    const data = JSON.parse( this.props.data );
    return (
      <div className="w-100 h-100">
        <video id={`video${data.id}`} controls style={{width: '100%'}}>
          <source src={ data.videoURL } type="video/mp4" />
        </video>
      </div>
    );
  }

  componentDidMount() {
    const vid = document.getElementById(`video${JSON.parse( this.props.data ).id}`);
    vid.onended = () => {
      this.props.onComplete()
    };
  }
}

export default LinkVideoResource;