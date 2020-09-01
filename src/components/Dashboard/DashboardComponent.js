import React , {Component} from 'react';

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

    render()
    {
        return (
            <React.Fragment>
            <h1>Dashboard</h1>
            </React.Fragment>
        )
    }
}

export default Dashboard;