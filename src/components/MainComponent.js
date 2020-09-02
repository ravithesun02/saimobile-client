import React , {Component} from 'react';
import Login from './Login/LoginComponent';
import { Route, Switch, Redirect } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import {baseUrl} from './Reusable/baseUrl';
import Dashboard from './Dashboard/DashboardComponent';
import { Backdrop, CircularProgress } from '@material-ui/core';
 
class Main extends Component{

    constructor(props)
    {
        super(props);
        this.state={
            isSignedIn:false,
            userdata:{},
            token:null,
            isLoading:false
        }
    }

   async componentDidMount()
    {
        console.log(this.props);

        this.setState({isLoading:true});
       
        if(typeof window != undefined)
            window.addEventListener('storage',this.authCheckup)
        
        await this.authCheckup();

        this.setState({isLoading:false});
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
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('isStaff');
    }

    render()
    {

        return (
        <BrowserRouter>
            <Switch>
                <Route exact path='/' component={Login}/>
                <Route exact path="/dashboard" component={()=> <Dashboard isSignedIn={this.state.isSignedIn} token={this.state.token} userdata={this.state.userdata} /> }/>
            </Switch>
            {
                this.state.isSignedIn ? <Redirect to='/dashboard' /> : <Redirect to='/'/>
            }

            <Backdrop  open={this.state.isLoading} style={{color:'#fff',zIndex:'10'}}>
                    <CircularProgress color="inherit" />
                </Backdrop>
        </BrowserRouter>
        )
    }
}

export default Main;