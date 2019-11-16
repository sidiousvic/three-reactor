import React from "react";
import Scene from "./Scene";
import "./App.css";

class App extends React.Component {
  constructor() {
    super();
    this.Scene = React.createRef();
  }
  render() {
    return (
      <Scene
        ref={r => {
          this.Scene = r;
        }}
      />
    );
  }
}

export default App;
