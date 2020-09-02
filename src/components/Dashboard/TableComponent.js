import React , {Component} from 'react';
import { Grid, withStyles,FormControl,InputLabel,Input, InputAdornment } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';

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

    render()
    {
        const {classes}=this.props;
        return(
          <Grid container spacing={1} className={classes.flex}>
           <Grid xs={12} className={[classes.flex,classes.margin]} justify="flex-end">
            <CssTextField placeholder="Search" label="Search" InputProps={{
                startAdornment:(
                    <InputAdornment position="start">
                    <SearchIcon style={{ color: 'white' }} />
                  </InputAdornment>
                )
            }} />
           </Grid>
           <Grid xs={12}>
            
            
           </Grid>

            
          </Grid>
        )
    }
}
export default withStyles(useStyles)(TabularComponent);