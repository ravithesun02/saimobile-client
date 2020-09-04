import React , {Component} from 'react';
import { Grid, withStyles,FormControl,InputLabel,Input, InputAdornment, Hidden } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import TableData from './TableData';

const useStyles=theme=>({

    flex:{
        display:'flex'
    },
    margin:{
        marginTop:'1%'
    }
   
   
});

const CssTextField = withStyles({
    root: {
     '& label.Mui-focused': {
      color: 'white',
     },
     '& .MuiFormLabel-root':{
        color:'white'
    },
    '& .MuiInputBase-input':{
        color:'white'
    },
    
     '& .MuiInput-underline:before':{
        borderBottomColor:'white'
     },
     '& .MuiInput-underline:after': {
      borderBottomColor: 'yellow',
     },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'white',
      },
      '&:hover fieldset': {
        borderColor: 'white',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'yellow',
      },
      
    },
  },
})(TextField);


class TabularComponent extends Component{

  componentDidMount()
  {
    
  }

  toggleEdit=(row)=>{
    console.log(row);
    this.props.onEdit(row);
  }

  showAlert=(alertType,alertMessage)=>{
   // console.log(alertType);
    this.props.showAlert(alertType,alertMessage);
  }

    render()
    {
        const {classes,data,isAdmin,isStaff,users}=this.props;
        // console.log(data);
        return(
          <Grid direction="row" container spacing={1} className={classes.flex}>
           <Grid item xs={12} className={[classes.flex,classes.margin]} justify="flex-end">
            <CssTextField placeholder="Search" label="Search" InputProps={{
                startAdornment:(
                    <InputAdornment position="start">
                    <SearchIcon style={{ color: 'white' }} />
                  </InputAdornment>
                )
            }} />
           </Grid>
           <Hidden smDown>
           <Grid item sm={12} md={12} style={{marginTop:'2%'}}>
            <TableData showAlert={(alertType,alertMessage)=>this.showAlert(alertType,alertMessage)} onEdit={(row)=>this.toggleEdit(row)} data={data} isAdmin={isAdmin} isStaff={isStaff} width={'100%'} users={users}/>
            
           </Grid>
           </Hidden>
           <Hidden smUp>
           <Grid item xs={12} style={{marginTop:'3%'}}>
            <TableData onEdit={(row)=>this.toggleEdit(row)} data={data} isAdmin={isAdmin} isStaff={isStaff} width={'100vw'} users={users} />
            
           </Grid>
           </Hidden>

            
          </Grid>
        )
    }
}
export default withStyles(useStyles)(TabularComponent);