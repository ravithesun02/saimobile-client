import React , {Component} from 'react';
import {Grid, Button, withStyles, Paper, Link, Typography, Hidden, Dialog, DialogTitle, DialogContent} from '@material-ui/core';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import {baseUrl} from '../Reusable/baseUrl';
import queryString from 'query-string';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles=theme=>({
    container:{
        flex:1,
        height:"100vh",
        backgroundColor:'#424242'
    },
    signIn:{
        background: 'linear-gradient(90deg, rgba(233,66,53,1) 7%, rgba(249,188,59,1) 36%, rgba(72,168,83,0.9164040616246498) 64%)',
        fontWeight:'bold'
    },
    dummy:{
        backgroundColor:'#162521',
        display:'flex'
    },
    dummy2:{
        display:'flex',
        backgroundColor:'#EEE2DF'
    },
    modalDialog:{
        width:'350px'
    },
    backdrop:{
        zIndex:theme.zIndex.drawer+1,
        color:'#fff'
    }
});



class Login extends Component{

    constructor(props)
    {
        super(props);
        this.state={
            isModal:false,
            token:null,
            userdata:{},
            loading:false
        }
    }

   async componentWillMount() {

       await this.setStorage();

      //  console.log(this.state.token);

        if(this.state.token!=null)
        {
           await this.fetchUserData();
        }
        
      }

      setStorage=async ()=>{
        var query = queryString.parse(this.props.location.search);
        if (query.token) {
          window.localStorage.setItem("jwt", query.token);
         await this.setState({token:query.token,loading:true});
          this.props.history.push("/");
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
                userdata:user
            });

            console.log(this.state.userdata);

            if(user.user_role.isAdmin && user.user_role.isStaff)
                this.setState({
                    isModal:true,
                    loading:false
                });
            else if(user.user_role.isAdmin)
            {
                localStorage.setItem('isAdmin',true);
                localStorage.setItem('isStaff',false);
                this.props.history.push('/dashboard');
            }
            else if(user.user_role.isStaff)
            {
                localStorage.setItem('isAdmin',false);
                localStorage.setItem('isStaff',true);
                this.props.history.push('/dashboard');
            }

        }
      }

      handleSignIn=()=>{
          this.setState({
            loading:true
          });
      }

      handleAdmin=()=>{

        localStorage.setItem('isAdmin',true);
        localStorage.setItem('isStaff',false);

        this.setState({
            isModal:false
        });

        this.props.history.push('/dashboard');

      }

      handleStaff=()=>{

        localStorage.setItem('isAdmin',false);
        localStorage.setItem('isStaff',true);

        this.setState({
            isModal:false
        });

        this.props.history.push('/dashboard');

      }


    render()
    {
        const {classes}=this.props;
        return(
            <div>
                <Grid className={classes.container} container>
                <Hidden xsDown>
                <Grid className={classes.dummy} item xs={false} sm={8} justify="center" alignItems="center">
                    <Typography variant="h2" style={{color:'white'}}>
                        Sai Tools & Repairing
                    </Typography>   
                </Grid>
                </Hidden>
                <Grid item className={classes.dummy2} container xs={12} sm={4} alignItems="center">
                    <Grid  item justify="center" alignItems="center" xs={12} style={{height:'90vh',display:'flex'}}>
                    <div style={{marginTop:'11vh'}}>
                    <Link href={baseUrl+'/admin/login'} underline="none"> 
                    <Paper elevation={3}>
                    
                        <Button className={classes.signIn} variant="contained" onClick={()=>this.handleSignIn}>
                            <LockOpenIcon color="primary" />
                            Login With Google
                        </Button>
                        </Paper>
                        </Link>
                        </div>
                    </Grid>
                    <Grid item justify="center" alignItems="center" xs={12} style={{height:'10vh',display:'flex'}}>
                        <small>Copyright©Sai Tools & Repairing @ 2020</small>
                    </Grid>
                    </Grid>
                </Grid>

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

                <Backdrop className={classes.backdrop} open={this.state.loading} >
                    <CircularProgress color="inherit" />
                </Backdrop>
            </div>
        )
    }
}

export default withStyles(useStyles)(Login);