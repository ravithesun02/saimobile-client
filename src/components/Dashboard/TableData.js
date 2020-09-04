import React , {Component} from 'react';
import { withStyles,Grid, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Typography, TablePagination, IconButton, InputLabel, Select, FormControl, MenuItem } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
const useStyles=theme=>({
    root: {
        width: '100vw',
      },
      container: {
        maxHeight: 440,
      },
      tableCell:{
          backgroundColor:'#798071',
          color:'white',
          minWidth:'16%'
      }
});


class TableData extends Component{
    constructor(props)
    {
        super(props);

        this.state={
            page:0,
            rowsPerPage:10,
            selectedUser:'none'
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

handleSelectedUser=(event)=>{

   // console.log(newValue);
   // console.log(event.target.value);
    this.setState({
        selectedUser:event.target.value
    });

}

validateAssign=()=>{
    if(this.state.selectedUser==='none')
    {
        this.props.showAlert('error','Please select a User from given list');
        return true;
    }
    return false;
}

handleAssign=(row)=>{
   // console.log(row);

    if(this.validateAssign())
    {
        return;
    }


    let user={};

    user._id=row._id;
    user.staff_id=this.state.selectedUser;

    this.props.users.forEach((item,index)=>{
        if(item._id===this.state.selectedUser)
        {
            user.staff_name=item.name;
        }
    });

    console.log(user);

}

   

    render()
    {
        const {classes,isAdmin,isStaff,width,users,data}=this.props;
        const {page,rowsPerPage} = this.state;
       // console.log(users);
        return(
            <Paper style={{width:width}} elevation={3}>
                <TableContainer className={classes.container}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" className={classes.tableCell}>IMEI No.</TableCell>
                                <TableCell align="center" className={classes.tableCell}>NAME</TableCell>
                                <TableCell align="center" className={classes.tableCell}>MOBILE No</TableCell>
                                <TableCell align="center" className={classes.tableCell}>STATUS</TableCell>
                                <TableCell align="center" className={classes.tableCell}>COST</TableCell>
                                { isAdmin && <TableCell align="center" className={classes.tableCell}>ASSIGNED</TableCell>}
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
                                            {
                                                !row.isEdit && 
                                                <IconButton onClick={()=>{
                                                    console.log(row);
                                                    this.props.onEdit(row);
                                                }}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            }
                                            {
                                                row.isEdit && 
                                                <Grid container justify="center">
                                                    <Grid item xs={6}>
                                                    <FormControl  style={{width:'100%'}}>
                                                <InputLabel>Users</InputLabel>
                                                <Select value={this.state.selectedUser}
                                                    onChange={this.handleSelectedUser}
                                                   
                                                >
                                                <MenuItem value='none'>None</MenuItem>
                                                {
                                                    users.map((item,index)=>{
                                                        return(
                                                            <MenuItem value={item._id}> {item.name.toUpperCase()} </MenuItem>
                                                        )
                                                    })
                                                }

                                                </Select>

                                                </FormControl>
                                                    </Grid>
                                                    <Grid item xs={2}>
                                                        <IconButton onClick={()=>{

                                                           // console.log(row);

                                                           this.handleAssign(row);
                                                            
                                                        }}>
                                                            <CheckIcon/>
                                                        </IconButton>
                                                    </Grid>
                                                    <Grid item xs={2}>
                                                        <IconButton onClick={()=>{
                                                           // console.log(row);
                                                            this.props.onEdit(row);
                                                        }}>
                                                            <CloseIcon/>
                                                        </IconButton>
                                                    </Grid>
                                                </Grid>
                                                
                                            }
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