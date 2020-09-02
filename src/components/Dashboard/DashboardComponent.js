import React , {Component} from 'react';
import Header from './HeaderComponent';
import { Grid, Button, withStyles, Hidden } from '@material-ui/core';
import TabComponent from './TabComponent';
import TabularComponent from './TableComponent';

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

        }
    }



    componentDidMount()
    {
        console.log(this.props);
    }

    handleNewTaskSubmission=(data)=>{

        console.log(data);

    }

    render()
    {
        const {classes}=this.props;
        return (
            <React.Fragment>
            <Grid direction="column" container className={classes.container}>
                <Grid item>
                <Header onDataReceive={(data)=>this.handleNewTaskSubmission(data)}/>
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