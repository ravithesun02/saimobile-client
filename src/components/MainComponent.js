import React , {Component} from 'react';
import Login from './Login/LoginComponent';
import { Route, Switch } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import {baseUrl} from './Reusable/baseUrl';
import Dashboard from './Dashboard/DashboardComponent';
 
class Main extends Component{

    constructor(props)
    {
        super(props);
        this.state={
            isSignedIn:false,
            userdata:{},
            token:null
        }
    }

   async componentDidMount()
    {
        console.log(this.props);
       
        if(typeof window != undefined)
            window.addEventListener('storage',this.authCheckup)
        
        await this.authCheckup();
    }

    componentWillUnmount()
    {
        if(typeof window != undefined)
            window.addEventListener('storage',this.logout)
    }

    fetchUserData=async ()=>{
        let res=await fetch(baseUrl+'/admin/loggedIn',{
            method:'GET',
            headers:{
                'Authorization':'Bearer '+this.state.token
            },
            credentials:'same-origin'
        });

        if(res.ok)
        {
            let data=await res.json();
            let user=data.user;
            console.log(user);
            await this.setState({
                userdata:user,
                isSignedIn:true
            });

        }
      }


    authCheckup=async ()=>{
        if(localStorage.getItem('jwt'))
        {
            await this.setState({token:localStorage.getItem('jwt')});
            await this.fetchUserData();
        }
        else
        {
            this.setState({
                isSignedIn:false,
                token:null,
                userdata:{}
            });
           // this.props.history.push("/");
        }
    }

    logout=()=>{
        localStorage.removeItem('jwt');
    }

    render()
    {
        return (

        <BrowserRouter>
            <Switch>
                <Route exact path='/' component={Login}/>
                <Route exact path="/dashboard" component={()=> <Dashboard isSignedIn={this.state.isSignedIn} token={this.state.token} userdata={this.state.userdata} /> }/>
            </Switch>
        </BrowserRouter>
        )
    }
}

export default Main;