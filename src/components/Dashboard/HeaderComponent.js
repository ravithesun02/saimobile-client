import React  from 'react';
import { AppBar, Toolbar, Typography, IconButton , Button, Hidden, withStyles} from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import FormDialog  from './FormDialogComponent';




const useStyles=theme=>({
    root:{
        flexGrow:1,
    },
    title: {
        flexGrow: 1,
      },
      appbar:{
          backgroundColor:'#52154E'
      }
})

class Header extends React.Component{

    constructor(props)
    {
        super(props);
        this.state={
            isOpen:false
        }
    }

    handleTask=()=>{
        this.setState({
            isOpen:!this.state.isOpen
        });
    }

    handleNewTaskSubmission=(data)=>{
       // console.log(data);
        this.props.onDataReceive(data);
    }

    render()
    {
        const {classes}=this.props;
        return(
            <React.Fragment>
           <div className={classes.root}>
                <AppBar className={classes.appbar} position="static">
                    <Toolbar>
                        <Hidden smDown>
                        <Typography className={classes.title} variant="h5">
                            Sai Tools & Repairing
                        </Typography>
                        </Hidden>
                        <Hidden smUp>
                        <Typography className={classes.title} variant="body1">
                        Sai Tools & Repairing
                    </Typography>
                        </Hidden>
                        <Button variant="contained" style={{backgroundColor:'#DA5552',color:'whitesmoke',marginRight:'2%'}} onClick={this.handleTask}>Add New Task</Button>
                   
                    <IconButton color="secondary" onClick={()=>this.props.logout()}>
                        <ExitToAppIcon/>
                    </IconButton>
                    </Toolbar>
                </AppBar>
            </div> 
            <FormDialog isOpen={this.state.isOpen} onClose={this.handleTask} onSubmit={(data)=>this.handleNewTaskSubmission(data)}/>
            </React.Fragment>
        )
    }
    
    

}

export default withStyles(useStyles)(Header);