import React , {Component} from 'react';
import Login from './Login/LoginComponent';
import { Route, Switch } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";

class Main extends Component{
    render()
    {
        return (

        <BrowserRouter>
            <Switch>
                <Route path='/' component={Login}/>
            </Switch>
        </BrowserRouter>
        )
    }
}

export default Main;