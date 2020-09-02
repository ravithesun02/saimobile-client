import React , {Component} from 'react';
import { withStyles, Paper, TableContainer, Table, TableHead, TableRow, TableCell } from '@material-ui/core';

const useStyles=theme=>({
    root: {
        width: '100%',
      },
      container: {
        maxHeight: 440,
      },
});


class TableData extends Component{
    constructor(props)
    {
        super(props);

        this.state={
            page:0,
            rowsPerPage:10
        }
    }

    handlePages=(event,newPage)=>{
        this.setState({
            page:newPage
        });
    }

    handleRowsperPage=(event)=>{
        this.setState({
            rowsPerPage:event.target.value,
            page:0
        });
    }

    render()
    {
        const {classes}=this.props;
        return(
            <Paper className={classes.root}>
                <TableContainer className={classes.container}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" style={{minWidth:170}}>IMEI No.</TableCell>
                                <TableCell align="center" style={{minWidth:170}}>NAME</TableCell>
                                <TableCell align="center" style={{minWidth:170}}>MOBILE No</TableCell>
                                <TableCell align="center" style={{minWidth:170}}>STATUS</TableCell>
                                <TableCell align="center" style={{minWidth:170}}>COST</TableCell>
                                <TableCell align="center" style={{minWidth:170}}>ASSIGNED</TableCell>
                            </TableRow>
                        </TableHead>
                        
                    </Table>
                </TableContainer>
            </Paper>

        )
    }
}

export default withStyles(useStyles)(TableData);