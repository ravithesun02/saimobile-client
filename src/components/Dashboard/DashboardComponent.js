import React , {Component} from 'react';
import Header from './HeaderComponent';
import { Grid, Button, withStyles, Hidden } from '@material-ui/core';
import TabComponent from './TabComponent';
import TabularComponent from './TableComponent';
import { baseUrl } from '../Reusable/baseUrl';
import { Redirect } from 'react-router-dom';

const useStyles=theme=>({

    container:{
        height:'100vh',
        background: 'linear-gradient(to right, #2C5364, #203A43, #0F2027)' /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

    },

    root:{
        padding:'2%'
    },
    addtaskgrid:{
        float:'right',
        display:'flex'
    }
})

class Dashboard extends Component
{
    constructor(props)
    {
        super(props);
        this.state={
            isSignedIn:false,
            userdata:{},
            token:null,
            isAdmin:false,
            isStaff:false
        }
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

   async componentWillMount()
    {
        if(this.props.isSignedIn)
        {
            this.setState({
                isSignedIn:this.props.isSignedIn,
                userdata:this.props.userdata,
                token:this.props.token
            });
        }
        else if(localStorage.getItem('jwt'))
        {
            await this.fetchUserData();
        }

        this.setState({
            isAdmin:localStorage.getItem('isAdmin'),
            isStaff:localStorage.getItem('isStaff')
        });
    }


    handleNewTaskSubmission=(data)=>{
        this.props.onSubmit(data);
    }

    logout=()=>{
        this.props.logout();
    }

    render()
    {
        const {classes}=this.props;

        if(!this.state.isSignedIn)
        {
            return(
                <Redirect to='/'/>
            )
        }

        return (
            <React.Fragment>
            <Grid direction="column" container className={classes.container}>
                <Grid item>
                <Header onDataReceive={(data)=>this.handleNewTaskSubmission(data)} logout={this.logout}/>
                <Grid item container direction="column" className={classes.root}>
                   
                <Grid item>
                    <TabComponent/>
                </Grid>

                <Grid item style={{marginTop:'1%'}}>
                    <TabularComponent/>
                </Grid>
                   
                </Grid>
                </Grid>
                </Grid>
            </React.Fragment>
        )
    }
}

export default withStyles(useStyles)(Dashboard);