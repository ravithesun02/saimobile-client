import React , {Component} from 'react';
import Header from './HeaderComponent';
import { Grid, Button, withStyles, Hidden ,Snackbar,Backdrop,CircularProgress} from '@material-ui/core';
import TabComponent from './TabComponent';
import TabularComponent from './TableComponent';
import { baseUrl } from '../Reusable/baseUrl';
import { Redirect } from 'react-router-dom';
import MuiAlert from '@material-ui/lab/Alert';


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
});

const Alert=(props) =>{
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

class Dashboard extends Component
{
    constructor(props)
    {
        super(props);
        this.state={
            isSignedIn:false,
            userdata:[],
            token:null,
            isAdmin:false,
            isStaff:false,
            isInvalid:false,
            alertMessage:'',
            alertType:'',
            selectedTab:0,
            isLoading:false,
            new_task:[],
            pending_task:[],
            completed_task:[],
            table_data:[]
        }
    }

    showAlert=(alertType,alertMessage)=>{

        this.setState({
            isInvalid:true,
            alertMessage:alertMessage,
            alertType:alertType
        });

    }

    handleAlertEnd=()=>{
        this.setState({
            isInvalid:false
        });
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
            await this.setState({
                userdata:user,
                isSignedIn:true
            });

        }
      }

   async componentWillMount()
    {

        //console.log(this.props);

        if(this.props.isSignedIn)
        {
           await this.setState({
                isSignedIn:this.props.isSignedIn,
                userdata:this.props.userdata,
                token:this.props.token
            });
        }
        else if(localStorage.getItem('jwt'))
        {
            await this.fetchUserData();
        }

        await this.setState({
            isAdmin:localStorage.getItem('isAdmin'),
            isStaff:localStorage.getItem('isStaff')
        });


        console.log(this.state);
    }

    async componentDidMount()
    {
        this.setState({
            isLoading:true
        });
        if(this.state.isAdmin)
        {
            await this.fetchNewTask();
        }
        

        this.setState({
            isLoading:false
        });

    }


    logout=()=>{
        this.props.logout();
    }


    handleTask=async (data)=>{
        try
        {
            let res=await fetch(baseUrl+'/customerAdmin/data',{
                method:'POST',
                headers:{
                    'Authorization':'Bearer '+this.state.token,
                    'Content-Type':'application/json'
                },
                credentials:'same-origin',
                body:JSON.stringify(data)
            });
    
            if(res.ok)
            {
                let result=await res.json();
    
                console.log(result);
    
                this.showAlert('success','Task has been added successfully');
    
            }
            else
            {
                this.showAlert('error','Task couldn\'t be added.\n Try again after sometime!!');
            }
        }
        catch(err)
        {
            this.showAlert('error',err);
        }
       
    }

    fetchNewTask=async ()=>{
        try
        {
            let res=await fetch(baseUrl+'/customerAdmin/data',{
                method:'GET',
                headers:{
                    'Authorization':'Bearer '+this.state.token
                },
                credentials:'same-origin'
            });

            if(res.ok)
            {
                let data=await res.json();

                console.log(data);

               await this.filterReceivedData(data.result);
            }
            else
            {
                this.showAlert('warning','Couldn\'t load data . Please check your Network connection');
            }
        }
        catch(err)
        {
            this.showAlert('error',err);
        }
       
    }

    filterReceivedData=async (result)=>{

        let new_task=[];
        let pending=[];
        let completed=[];

        result.forEach((item,index)=>{
            if(item.staff_name)
            {
                if(item.status)
                    completed.push(item);
                else
                    pending.push(item);
            }
            else
            new_task.push(item);
        });

       await this.setState({
            new_task:new_task,
            pending_task:pending,
            completed_task:completed
        });

    }

    handleTabChange=async (data)=>{
        // 0:-Pending task 1:- completed task 2:-new task (only for admin) 3:-Income
        console.log(data);
        await this.setState({
            selectedTab:data
        });

        if(data===0)
            this.setState({
                table_data:this.state.pending_task
            });
        else if(data===1)
            this.setState({
                table_data:this.state.completed_task
            }); 
        else if(data===2)
            this.setState({
                table_data:this.state.new_task
            });
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
                <Header onDataReceive={(data)=>this.handleTask(data)} logout={this.logout}/>
                <Grid item container direction="column" className={classes.root}>
                   
                <Grid item>
                    <TabComponent onChange={(data)=>this.handleTabChange(data)} isAdmin={this.state.isAdmin} isStaff={this.state.isStaff}/>
                </Grid>

                <Grid item style={{marginTop:'1%'}}>
                    <TabularComponent data={this.state.table_data}/>
                </Grid>
                   
                </Grid>
                </Grid>
                </Grid>
                <Snackbar open={this.state.isInvalid} onClose={this.handleAlertEnd} autoHideDuration={5000} anchorOrigin={{horizontal:'center',vertical:'top'}}>
                <Alert severity={this.state.alertType} >
                {this.state.alertMessage}
                </Alert>
            </Snackbar>
            <Backdrop  open={this.state.isLoading} style={{color:'#fff',zIndex:'10'}}>
            <CircularProgress color="inherit" />
        </Backdrop>
            </React.Fragment>
        )
    }
}

export default withStyles(useStyles)(Dashboard);