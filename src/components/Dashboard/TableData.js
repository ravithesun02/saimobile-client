import React , {Component} from 'react';
import { withStyles, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Typography, TablePagination } from '@material-ui/core';

const useStyles=theme=>({
    root: {
        width: '100vw',
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
        const {classes,data,isAdmin,isStaff,width}=this.props;
        const {page,rowsPerPage} = this.state;
        return(
            <Paper style={{width:width}} elevation={3}>
                <TableContainer className={classes.container}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" style={{minWidth:'16%'}}>IMEI No.</TableCell>
                                <TableCell align="center" style={{minWidth:'16%'}}>NAME</TableCell>
                                <TableCell align="center" style={{minWidth:'16%'}}>MOBILE No</TableCell>
                                <TableCell align="center" style={{minWidth:'16%'}}>STATUS</TableCell>
                                <TableCell align="center" style={{minWidth:'16%'}}>COST</TableCell>
                                { isAdmin && <TableCell align="center" style={{minWidth:'16%'}}>ASSIGNED</TableCell>}
                            </TableRow>
                        </TableHead>
                       { data.length>0 && <TableBody>
                            {
                                data.slice(page*rowsPerPage,page*rowsPerPage+rowsPerPage).map((row,index)=>{
                                    return(
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                                            <TableCell key={`${row._id}-imei`} align="center">
                                                {row.imei}
                                            </TableCell>
                                            <TableCell key={`${row._id}-name`} align="center">
                                            {row.name}
                                        </TableCell>
                                        <TableCell key={`${row._id}-mobile`} align="center">
                                        {row.mobile}
                                    </TableCell>
                                            <TableCell key={`${row._id}-status`} align="center">
                                             {row.status ? 'Completed':'Pending'}
                                            </TableCell>
                                            <TableCell key={`${row._id}-cost`} align="center">
                                                {row.cost ? row.cost : 'N/A'}
                                            </TableCell>
                                            {isAdmin && <TableCell key={`${row._id}-assigned`} align="center">
                                            {row.staff_name? row.staff_name : 'N/A'}
                                            </TableCell>}
                                        </TableRow>
                                    )
                                })
                            }
                        </TableBody>}
                        {data.length === 0 && 
                            <TableBody>
                                <Typography variant="h6">
                                    No Data Available
                                </Typography>
                            </TableBody>
                        }
                    </Table>
                </TableContainer>
                <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={this.handlePages}
                onChangeRowsPerPage={this.handleRowsperPage}
                />
            </Paper>

        )
    }
}

export default withStyles(useStyles)(TableData);