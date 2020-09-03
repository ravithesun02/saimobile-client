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

    handleTabChange=async (event,newValue)=>{
        await this.setState({
            tabValue:newValue
        });

        this.props.onChange(this.state.tabValue);

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
                <Tab label="Pending Task" value={0}/>

                <Tab label="Completed Task" value={1} />

               {this.props.isAdmin && <Tab label="New Task" value={2} />}

                <Tab label="Income" value={3} />
                
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