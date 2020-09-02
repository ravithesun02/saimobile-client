import React , {Component} from 'react';
import { AppBar, Tabs, Tab, Paper, Hidden } from '@material-ui/core';


class TabComponent extends Component{

    constructor(props)
    {
        super(props);
        this.state={
            tabValue:0
        }
    }

    handleTabChange=(event,newValue)=>{
        this.setState({
            tabValue:newValue
        });
    }

    render()
    {
        return(
            <div >
            <Hidden smDown>
            <Paper square>
                <Tabs
                  value={this.state.tabValue}
                  onChange={this.handleTabChange}
                  indicatorColor="secondary"
                  textColor="secondary"
                  variant="fullWidth"
                >
                <Tab label="Pending Task"/>

                <Tab label="Completed Task" />

                <Tab label="New Task" />

                <Tab label="Income" />
                
                </Tabs>

            </Paper>
            </Hidden>
            <Hidden smUp>

            <Paper square>
                <Tabs
                  value={this.state.tabValue}
                  onChange={this.handleTabChange}
                  indicatorColor="secondary"
                  textColor="secondary"
                  variant="scrollable"
                >
                <Tab label="Pending Task"/>

                <Tab label="Completed Task" />

                <Tab label="New Task" />

                <Tab label="Income" />
                
                </Tabs>

            </Paper>

            </Hidden>
                
            </div>
        )
    }

}

export default TabComponent;