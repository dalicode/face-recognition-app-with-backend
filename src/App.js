import React from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';

const particlesOptions = {
   "particles": {
          "number": {
              "value": 50,
              "density": {
                "enable": true,
                "value_area": 800
              }
          },
          "size": {
              "value": 3
          }
      },
      "interactivity": {
          "events": {
              "onhover": {
                  "enable": true,
                  "mode": "repulse"
              }
          }
      }
  }

const app = new Clarifai.App({
 apiKey: 'c400f7a917204671b49178f2da246228'
});

class App extends React.Component {
  constructor(){
    super()
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false
    }
  }

calculateFaceLocation = (data) => {
  const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box
  const image = document.getElementById('inputImage');
  const width = Number(image.width);
  const height = Number(image.height);
  return {
    leftCol: clarifaiFace.left_col * width,
    topRow: clarifaiFace.top_row * height,
    rightCol: width - (clarifaiFace.right_col * width),
    bottomRow: height - (clarifaiFace.bottom_row * height)
  }
}

displayFaceBox = (box) => {
  this.setState({box:box});
}

onInputChange = (event) => {
    this.setState({input:event.target.value});
  }

onButtonSubmit= () => {
  this.setState({imageUrl:this.state.input});

app.models.predict('a403429f2ddf4b49b307e318f00e528b', this.state.input)
  .then(response => {
    //console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
    this.displayFaceBox(this.calculateFaceLocation(response));
  })
  .catch(err => {
    console.log(err);
  });
}

onRouteChange = (route) => {
  if (route === 'signout'){
    this.setState({isSignedIn:false})
    route = 'signin';
  } else if (route === 'home') {
    this.setState({isSignedIn: true})
  }
  this.setState ({route: route});
}

render() {
    return (
      <div className="App">
        <Particles className='particles'
          params={particlesOptions} />
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
        {this.state.route === 'signin' 
          ? <SignIn onRouteChange={this.onRouteChange}/>
          : this.state.route === 'register'
          ? <Register onRouteChange={this.onRouteChange}/>
          : <div>
              <Logo />
              <Rank />
              <ImageLinkForm onInputChange={this.onInputChange} 
              onButtonSubmit={this.onButtonSubmit}/> 
              <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
            </div>
          }
      </div>
    );
  }
}
export default App;
