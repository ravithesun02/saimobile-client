import React , {Component} from 'react';
import Login from './Login/LoginComponent';
import { Route, Switch, Redirect } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import {baseUrl} from './Reusable/baseUrl';
import Dashboard from './Dashboard/DashboardComponent';
import { Backdrop, CircularProgress ,Snackbar,Dialog,DialogTitle,DialogContent,Button,Grid, withStyles} from '@material-ui/core';
import PropTypes from 'prop-types';


  const useStyles=theme=>({
   
    modalDialog:{
        width:'350px'
    }
});
class Main extends Component{

    constructor(props)
    {
        super(props);
        this.state={
            isSignedIn:false,
            userdata:[],
            token:null,
            isLoading:false,
            isModal:false
        }
        this.child = React.createRef();
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
            window.removeEventListener('storage',this.authCheckup)
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
            let user=[];
            user.push(data.user);
           // console.log(user);
            await this.setState({
                userdata:user
            });

        

        }
      }


    authCheckup=async ()=>{
        console.log('called');
        if(localStorage.getItem('jwt'))
        {
            
            await this.setState({token:localStorage.getItem('jwt')});
            await this.fetchUserData();

            if(!localStorage.getItem('isAdmin'))
            {
                if(this.state.userdata[0].user_role.isAdmin && this.state.userdata[0].user_role.isStaff)
                this.setState({
                    isModal:true,
                    loading:false
                });
                else if(this.state.userdata[0].user_role.isAdmin)
                {
                    localStorage.setItem('isAdmin',true);
                    localStorage.setItem('isStaff',false);
                    this.setState({isSignedIn:true});
                   
                }
                else if(this.state.userdata[0].user_role.isStaff)
                {
                    localStorage.setItem('isAdmin',false);
                    localStorage.setItem('isStaff',true);
                    this.setState({isSignedIn:true});
                }
            }
            else
            {
                this.setState({
                    isSignedIn:true
                });
            }
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

    handleAdmin=()=>{

        localStorage.setItem('isAdmin',true);
        localStorage.setItem('isStaff',false);

        this.setState({
            isModal:false
        });

        this.setState({isSignedIn:true});

      }

      handleStaff=()=>{

        localStorage.setItem('isAdmin',false);
        localStorage.setItem('isStaff',true);

        this.setState({
            isModal:false
        });

        this.setState({isSignedIn:true});

      }


    logout=async ()=>{
        localStorage.removeItem('jwt');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('isStaff');
        await this.authCheckup();
    }

   

    

    render()
    {

        const {classes}=this.props;

        return (
        <BrowserRouter>
            <Switch>
                <Route exact path='/' component={Login}/>
                <Route exact path="/dashboard" component={()=> <Dashboard logout={this.logout} isSignedIn={this.state.isSignedIn} token={this.state.token} userdata={this.state.userdata} /> }/>
            </Switch>
            {
                this.state.isSignedIn ? <Redirect to='/dashboard' /> : <Redirect to='/'/>
            }

            <Backdrop  open={this.state.isLoading} style={{color:'#fff',zIndex:'10'}}>
                    <CircularProgress color="inherit" />
                </Backdrop>
               

            <Dialog 
            open={this.state.isModal}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
        <DialogTitle id="alert-dialog-title">{"Login As:-"}</DialogTitle>
        <DialogContent dividers>
        <Grid className={classes.modalDialog} container spacing={2}>
        <Grid item xs={6}>
            <Button variant="contained" color="primary" fullWidth="true" onClick={this.handleAdmin}>Admin</Button>
        </Grid>
        <Grid item xs={6}>
            <Button variant="contained" color="secondary" fullWidth="true" onClick={this.handleStaff}>Staff</Button>
        </Grid>
    </Grid>
        </DialogContent>
       
        </Dialog>
        </BrowserRouter>
        )
    }
}

Main.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(useStyles)(Main);