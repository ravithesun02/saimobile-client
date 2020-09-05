import React , {Component} from 'react';
import { Grid, withStyles, InputAdornment, IconButton } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import TableData from './TableData';
import RotateLeftSharpIcon from '@material-ui/icons/RotateLeftSharp';

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

  constructor(props)
  {
    super(props);
    this.state={
      toggleReset:false,
      searchTerm:''
    }
  }

  toggleEdit=(row)=>{
  //  console.log(row);
    this.props.onEdit(row);
  }

  showAlert=(alertType,alertMessage)=>{
   // console.log(alertType);
    this.props.showAlert(alertType,alertMessage);
  }

  handleFocus=()=>{
   this.setState({
     toggleReset:!this.state.toggleReset,
     searchTerm:''
   });
  }

  reset=()=>{
    this.setState({
      toggleReset:false,
      searchTerm:''
    });
  }

  componentDidUpdate(nextProps)
  {
    const {tabValue}=this.props;

    if(tabValue !== nextProps.tabValue)
    {
      this.reset();
    }
  }

  handleSearchChange=(event)=>{

    this.setState({
      searchTerm:event.target.value
    })
    this.props.onSearch(event.target.value);

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
                  
                  
                ),
                endAdornment:(
                  <InputAdornment position="end">
                 {this.state.toggleReset && 
                   <IconButton onClick={()=>{this.props.closeSearch();this.reset();}}>
                    <RotateLeftSharpIcon style={{ color: 'white' }} />
                  </IconButton>}
                  </InputAdornment>
                )
            }} 
            value={this.state.searchTerm}
            onFocus={this.handleFocus}

            onChange={this.handleSearchChange}
            
            />
           </Grid>
          
           <Grid item sm={12} md={12} style={{marginTop:'2%'}}>
            <TableData userdata={this.props.userdata} handleStatus={(data)=>this.props.handleStatus(data)} onDelete={(data)=>this.props.onDelete(data)} tabValue={this.props.tabValue} onAssign={(data)=>this.props.onAssign(data)} showAlert={(alertType,alertMessage)=>this.showAlert(alertType,alertMessage)} onEdit={(row)=>this.toggleEdit(row)} data={data} isAdmin={isAdmin} isStaff={isStaff} width={'95vw'} users={users}/>
            
           </Grid>
           
          

            
          </Grid>
        )
    }
}
export default withStyles(useStyles)(TabularComponent);