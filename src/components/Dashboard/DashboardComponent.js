import React , {Component} from 'react';
import Header from './HeaderComponent';
import { Grid, withStyles ,Snackbar,Backdrop,CircularProgress} from '@material-ui/core';
import TabComponent from './TabComponent';
import TabularComponent from './TableComponent';
import { baseUrl } from '../Reusable/baseUrl';
import { Redirect } from 'react-router-dom';
import MuiAlert from '@material-ui/lab/Alert';
import Income from './IncomeComponent';


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
            table_data:[],
            table_dataCopy:[],
            all_user:[],
            total_task:[]
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

        ////console.log(this.props);
        this.setState({
            isLoading:true
        });

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
            isAdmin:JSON.parse(localStorage.getItem('isAdmin')),
            isStaff:JSON.parse(localStorage.getItem('isStaff'))
        });


        await this.fetchNewTask();

        await this.fetchAllusers();

        this.setState({
            table_data:this.state.pending_task,
            table_dataCopy:this.state.pending_task
        })
        

        this.setState({
            isLoading:false
        });

        //console.log(this.state);
    }


    logout=()=>{
        this.props.logout();
    }


    handleTask=async (data)=>{

        await this.setState({
            isLoading:true
        });
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
    
                //console.log(result);

                if(this.state.isAdmin)
                {
                    await this.fetchNewTask();
                }
    
                this.showAlert('success','Task has been added successfully');

               await this.setState({
                isLoading:false
            });
    
            }
            else
            {
                this.showAlert('error','Task couldn\'t be added.\n Try again after sometime!!');

               await this.setState({
                isLoading:false
            });
            }
        }
        catch(err)
        {
            this.showAlert('error',err);

            await this.setState({
                isLoading:false
            });
        }
       
    }

    fetchNewTask=async ()=>{
        let url='';
        if(this.state.isAdmin)
        {
            url=baseUrl+'/customerAdmin/data';
        }
        else if(this.state.isStaff)
        {
            url=baseUrl+'/customerAdmin/userBase';
        }
        try
        {
            let res=await fetch(url,{
                method:'GET',
                headers:{
                    'Authorization':'Bearer '+this.state.token
                },
                credentials:'same-origin'
            });

            if(res.ok)
            {
                let data=await res.json();

                //console.log(data);

               await this.setState({
                    total_task:data.result
                });

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
                   { 
                       item.isEdit=false;
                       pending.push(item);
                   }
            }
            else
            {
                item.isEdit=false;
                new_task.push(item);
            }
        });

        //console.log(new_task);

       await this.setState({
            new_task:new_task,
            pending_task:pending,
            completed_task:completed
        });

       await this.handleTabChange(this.state.selectedTab);

    }

    handleTabChange=async (data)=>{
        // 0:-Pending task 1:- completed task 2:-new task (only for admin) 3:-Income
        //console.log(data);
        await this.setState({
            selectedTab:data
        });

        if(data===0)
           await this.setState({
                table_data:this.state.pending_task
            });
        else if(data===1)
           await this.setState({
                table_data:this.state.completed_task
            }); 
        else if(data===2)
           await this.setState({
                table_data:this.state.new_task
            });

        //console.log(this.state.table_data);

        await this.setState({
            table_dataCopy:this.state.table_data
        });
    }

    fetchAllusers=async ()=>{

        try
        {
            let res=await fetch(baseUrl+'/admin/getAlluser',{
                method:'GET',
                headers:{
                    'Authorization':'Bearer '+this.state.token
                },
                credentials:'same-origin'
            });

            if(res.ok)
            {
                let data=await res.json();
                
                let users=data.result;

                await this.setState({
                    all_user:users
                });

            }
            else
            {
                this.showAlert('warning','Server Error!!');
            }
    
        }
        catch(err)
        {

            this.showAlert('error','Server Error!!-'+err);
        }

    

    }

    toggleIsEdit=async (row)=>{
        let data=this.state.table_data;
        data.forEach((item,index)=>{
            if(item._id===row._id)
            {
                item.isEdit=!item.isEdit;
            }
        });

        await this.setState({
            table_data:data
        });
    }

    postAssignData=async (data)=>{

        this.setState({
            isLoading:true
        });

        let url='';

        if(this.state.isStaff && this.state.selectedTab===0)
            url=baseUrl+'/customerAdmin/data';
        else if(this.state.isAdmin && this.state.selectedTab===2)
            url=baseUrl+'/customerAdmin/assign';

        try
        {
            let res=await fetch(url,{
                method:'PUT',
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':'Bearer '+this.state.token
                },
                credentials:'same-origin',
                body:JSON.stringify(data)
            });

            if(res.ok)
            {
                let result=await res.json();

                //console.log(result);

                await this.fetchNewTask();

                this.showAlert('success','Task assigned successfully!');

               await this.setState({
                    isLoading:false
                });
            }
            else
            {
                this.showAlert('error','Try again !!');

               await this.setState({
                isLoading:false
            });
            }
        }
        catch(err)
        {
            this.showAlert('error','Server Error - '+err);

            await this.setState({
                isLoading:false
            });
        }

    }

    deleteNewTask=async (data)=>{
        // //console.log(data);
        // let user={};
        // user._id=data._id;
        this.setState({
            isLoading:true
        });
        try
        {
            let res=await fetch(baseUrl+'/customerAdmin/data',{
                method:'DELETE',
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':'Bearer '+this.state.token
                },
                credentials:'same-origin',
                body:JSON.stringify(data)
            });

            if(res.ok)
            {
                let result=await res.json();

                //console.log(result);

                await this.fetchNewTask();

                this.showAlert('success','Deleted successfully !!');

                this.setState({
                    isLoading:false
                });
            }
            else
            {
                this.showAlert('error','Try again !!');
                this.setState({
                    isLoading:false
                });
            }
        }
        catch(err)
        {
            this.showAlert('error','Server Error '+err);

            this.setState({
                isLoading:false
            });
        }
    }

    postStatusUpdate= async (data)=>{
        this.setState({
            isLoading:true
        });
        try
        {
            let res=await fetch(baseUrl+'/customerAdmin/statusUpdate',{
                method:'PUT',
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':'Bearer '+this.state.token
                },
                credentials:'same-origin',
                body:JSON.stringify(data)
            });

            if(res.ok)
            {
                let result=await res.json();

                //console.log(result);

                await this.fetchNewTask();

                this.showAlert('success','Status updated successfully.');
                this.setState({
                    isLoading:false
                });
            }
            else
            {
                this.showAlert('error','Failed to update');
                this.setState({
                    isLoading:false
                });
            }

        }
        catch(err)
        {
            this.showAlert('error','Server error '+err);
            this.setState({
                isLoading:false
            });
        }
    }

    onSearch=async (searchTerm)=>{

        let tableData;
        
        //console.log(searchTerm);

        tableData=this.state.table_data.filter((item)=>{
            //console.log(item.name.includes(searchTerm));
            return (
                item.imei.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 || 
                item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1||
                item.mobile.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
                item.staff_name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
                item.remark.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
                item.cost=== searchTerm
            );
        });

        //console.log(tableData);

       await this.setState({
            table_data:tableData
        });
    }

    resetSearch=()=>{
        this.setState({
            table_data:this.state.table_dataCopy
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

                {this.state.selectedTab !== 3 && 
                    <Grid item style={{marginTop:'1%'}}>
                    <TabularComponent closeSearch={()=>this.resetSearch()} onSearch={(data)=>this.onSearch(data)} userdata={this.state.userdata} handleStatus={(data)=>this.postStatusUpdate(data)} onDelete={(data)=>this.deleteNewTask(data)} tabValue={this.state.selectedTab} onAssign={(data)=>this.postAssignData(data)} showAlert={(alertType,alertMessage)=>this.showAlert(alertType,alertMessage)} onEdit={(row)=>this.toggleIsEdit(row)} data={this.state.table_data} users={this.state.all_user} isAdmin={this.state.isAdmin} isStaff={this.state.isStaff}/>
                    </Grid>
                }
                {
                    this.state.selectedTab===3 &&
                    <Grid item style={{marginTop:'1%'}}>
                        <Income showAlert={(alertType,alertMessage)=>this.showAlert(alertType,alertMessage)} total_task={this.state.total_task} isAdmin={this.state.isAdmin} isStaff={this.state.isStaff} users={this.state.all_user} />
                    </Grid>
                }
                   
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