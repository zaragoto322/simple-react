import React, {Component} from "./lib/react"
import ReactDOM from "./lib/react-dom"


function Menu(props) {
    return <h1>menu {props.title}</h1>
}

class App extends Component {
    constructor(props) {
        super(props)

        this.states = {
            title: 'zaragto'
        }


    }

    handleClick() {
        this.setStates({
            title: 'change'
        })
    }


    render() {
        return (
            <div>
                <Menu title={this.states.title}></Menu>
                <h1>{ this.states.title}</h1>
                <p>{ this.props.id}</p>
                <span onClick={this.handleClick.bind(this)}>hello</span>
            </div>
        );
    }
}

// {/* <APP>
//     <Navbar></Navbar>
//     <p>hello</p>
// </APP> */}

ReactDOM.render((
    <App id = "app">hello</App>
), document.body)




