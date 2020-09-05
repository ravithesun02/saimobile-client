import React ,  {Component} from 'react';
import { withStyles, Grid, TextField, Button, Typography } from '@material-ui/core';
import moment from 'moment';

const useStyles=theme=>({

    container:{
        display:'flex',
        justifyContent:'center',
        marginTop:'1%'
    },
    container1:{
        display:'flex',
        justifyContent:'space-around',
        marginTop:'1%',
        alignItems:'center'
    },
    income:{
        display:'flex',
        justifyContent:'space-around',
        marginTop:'1%',
        padding:'1%',
        color:'white',
        alignItems:'center'
        
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
    '& .MuiFormHelperText-root':{
        color:'darkturquoise'
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

class Income extends Component
{

    constructor(props){
        super(props);
        this.state={
            total_task:[],
            users:[],
            isAdmin:false,
            isStaff:false,
            end_date:moment().format('YYYY-MM-DD'),
            start_date:moment().subtract(30, 'days').format('YYYY-MM-DD'),
            total_income:0,
            toggle:false
        }
    }

   async componentDidMount()
    {
        let data=this.props.users;

        data.forEach((item,index)=>{
            item.total_income=0;
        });

      //  console.log(data);

       await this.setState({
            total_task:this.props.total_task,
            users:data,
            isStaff:this.props.isStaff,
            isAdmin:this.props.isAdmin
        });


      //  console.log(this.state);

    }

    calculateTotalIncome=async ()=>{
        let total=0;
        this.state.total_task.forEach((item,index)=>{
            let date=moment(item.updatedAt).format('YYYY-MM-DD');
            if(item.status && (date>=this.state.start_date && date<=this.state.end_date))
                total+=item.cost;
        });

       await this.setState({
            total_income:total
        });
    }

    incomeOfEachUser=async ()=>{
        let users=this.state.users;

        this.state.total_task.forEach((item,index)=>{
            let date=moment(item.updatedAt).format('YYYY-MM-DD');
            if(item.status && (date>=this.state.start_date && date<=this.state.end_date))
            {
                users.forEach((element,index)=>{
                    if(element._id === item.staff_id)
                    {
                        element.total_income+=item.cost
                    }
                });
            }
        });

       await this.setState({
            users:users
        });
    }

    handleStartChange=(event)=>{
       // console.log(event.target.value);
       if(this.state.end_date<event.target.value)
        {
            this.props.showAlert('error','End date can\'t be less than start date');
            return;
        }
        this.setState({
            start_date:event.target.value
        });
    }
    handleEndChange=(event)=>{
        if(this.state.start_date>event.target.value)
        {
            this.props.showAlert('error','End date can\'t be less than start date');
            return;
        }
        this.setState({
            end_date:event.target.value
        });
    }

    handleCalculate=async ()=>{

        await this.calculateTotalIncome();

        if(this.state.isAdmin)
        {
            this.resetIncomeofUsers();
            await this.incomeOfEachUser();
        }
       

        this.setState({
            toggle:true
        });

    }

    resetIncomeofUsers=()=>{
        let data=this.state.users;

        data.forEach((item,index)=>{
            item.total_income=0;
        });
    }

    render()
    {
        const {classes}=this.props;
        return (
            <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={6} className={classes.container}>
                    <CssTextField 
                    id="date"
                    label="Start Date"
                    type="date"
                    value={this.state.start_date}
                    onChange={this.handleStartChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    helperText="MM/DD/YYYY"
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={6} className={classes.container1}>
                <CssTextField 
                id="date"
                label="End Date"
                type="date"
                value={this.state.end_date}
                onChange={this.handleEndChange}
                InputLabelProps={{
                  shrink: true,
                }}

                helperText="MM/DD/YYYY"
                />

                <Button variant="contained" color="secondary" style={{height:'50%'}} onClick={this.handleCalculate}>
                    Calculate 
                </Button>
                </Grid>

               { (this.state.toggle && this.state.isAdmin) && <Grid item container>
                {
                    this.state.users.map((item,index)=>{
                        return(
                            <Grid item xs={12} className={classes.income}>
                            <Typography key={index} style={{marginTop:'2%'}} variant="h6"> Income from {item.name} : {item.total_income} </Typography>
                            </Grid>
                            )
                    })
                }
                </Grid>}

                { this.state.toggle &&
                     <Grid item xs={12} className={classes.income}>
                    <Typography style={{marginTop:'2%'}} variant="h6"> Total Income : {this.state.total_income} </Typography>
                </Grid>}
               
            </Grid>
        )
    }

}

export default withStyles(useStyles)(Income);