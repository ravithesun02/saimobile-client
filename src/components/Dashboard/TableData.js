import React , {Component} from 'react';
import { withStyles,Grid, Paper, TableContainer,DialogTitle,DialogActions,Button, Table, TableHead, TableRow, TableCell, TableBody, Typography, TablePagination, IconButton, InputLabel, Select, FormControl, MenuItem, Dialog, DialogContent, TextField } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import moment from 'moment';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';
const useStyles=theme=>({
    root: {
        width: '100vw',
      },
      container: {
        maxHeight: '50vh',
      },
      tableCell:{
          backgroundColor:'#798071',
          color:'white',
          minWidth:'16%'
      },
      dialogPaper:{
        minHeight:'30vh',
        minWidth:'80vw'
    },
    dialogTitle:{
        display:'flex',
        justifyContent:'space-between',
        alignItems:'center'
    },
    footerModal:{
        display:'flex',
        justifyContent:'space-around'
    },
    buttonWidth:{
        width:'25%'
    }
});


class TableData extends Component{
    constructor(props)
    {
        super(props);

        this.state={
            page:0,
            rowsPerPage:10,
            selectedUser:'none',
            remarkModalOpen:false,
            remarkModalData:'',
            editModalOpen:false,
            status:'none',
            cost:0,
            editDetail:[]
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

    this.props.onAssign(user);

}

   setModalOpen=(row)=>{
       this.setState({
           remarkModalOpen:true,
           remarkModalData:row.remark
       });
   }

   handleCancel=()=>{
       this.setState({
           remarkModalOpen:false,
           remarkModalData:''
       })
   }

   handleChange=name=>event=>{
    this.setState({
        [name]:event.target.value
    })
}

handleEditModalOpen=(row)=>{
    let data=[];
    data.push(row);

    this.setState({
        editModalOpen:true,
        editDetail:data
    });

}

handleEditModal=()=>{
    this.setState({
        editModalOpen:false,
        editDetail:[],
        status:'none',
        cost:0
    });
}

    validateEdit=()=>{

        if(this.state.status==='none' || this.state.cost<0)
        {
            this.props.showAlert('error','Not a valid Input ! Try Again !!');
            return true;
        }
        return false;

    }

    handleSubmit=()=>{

        if(this.validateEdit())
            return;
        
        let data={};

        data._id=this.state.editDetail[0]._id;
        data.status=true;
        data.cost=this.state.cost;

        console.log(data);

        this.props.handleStatus(data);

        this.handleEditModal();


    }

    render()
    {
        const {classes,isAdmin,isStaff,width,users,data,tabValue}=this.props;
        const {page,rowsPerPage} = this.state;
       // console.log(users);
        return(
            <React.Fragment>
            <Paper style={{width:width}} elevation={3}>
                <TableContainer className={classes.container}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" className={classes.tableCell}>IMEI No.</TableCell>
                                <TableCell align="center" className={classes.tableCell}>NAME</TableCell>
                                <TableCell align="center" className={classes.tableCell}>MOBILE No</TableCell>
                                <TableCell align="center" className={classes.tableCell}> {tabValue===0 ? 'ASSIGNED ON':tabValue === 1 ? 'COMPLETED ON':'ADDED ON'} </TableCell>
                                <TableCell align="center" className={classes.tableCell}>STATUS</TableCell>
                                <TableCell align="center" className={classes.tableCell}>COST</TableCell>
                                { isAdmin && <TableCell align="center" className={classes.tableCell}>ASSIGNED</TableCell>}
                                <TableCell align="center" className={classes.tableCell}> VIEW / EDIT </TableCell>
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
                                            <TableCell key={`${row._id}-date`} align="center">
                                            {tabValue===0 || tabValue===1 ? `${moment(row.updatedAt).format('DD-MM-YYYY')}` : `${moment(row.createdAt).format('DD-MM-YYYY')}` }
                                            </TableCell>
                                            <TableCell key={`${row._id}-status`} align="center">
                                             {row.status ? 'Completed':'Pending'}
                                            </TableCell>
                                            <TableCell key={`${row._id}-cost`} align="center">
                                                {row.cost ? row.cost : 'N/A'}
                                            </TableCell>
                                            {isAdmin && <TableCell key={`${row._id}-assigned`} align="center">
                                            {row.staff_name && `${row.staff_name}`}
                                            {
                                                (!row.isEdit && !row.staff_name) && 
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

                                            <TableCell>

                                            <Grid container justify="center">
                                                {
                                                    tabValue!==2 && 
                                                    <Grid item xs={2}>
                                                    </Grid>
                                                }
                                                <Grid item xs={4}>
                                                <IconButton onClick={()=>{
                                                    this.setModalOpen(row)
                                                }}>
                                                    <VisibilityIcon />
                                                </IconButton>
                                                </Grid>
                                             {tabValue!==1 &&
                                                   <Grid item xs={4}>
                                                   <IconButton onClick={()=>{
                                                       this.handleEditModalOpen(row)
                                                   }}>
                                                    <EditIcon/>
                                                   </IconButton> 
                                                </Grid>}

                                                {
                                                    tabValue===2 && 
                                                    <Grid item xs={4}>
                                                    <IconButton onClick={()=>{
                                                        console.log(row);

                                                        this.props.onDelete(row);
                                                    }}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                    </Grid>
                                                }

                                            </Grid>

                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            }
                        </TableBody>}
                        {data.length === 0 && 
                                <TableBody>
                                    <TableRow>
                                    
                                    <Typography variant="h6">
                                    No Data Available
                                    </Typography>
                                    </TableRow>
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
            <Dialog
              open={this.state.remarkModalOpen}
              classes={{ paper: classes.dialogPaper }}
            >
            <DialogTitle className={classes.dialogTitle} disableTypography> 
                <Typography variant="h6">
                    Remarks
                </Typography>
                <IconButton onClick={this.handleCancel}>
                <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                {this.state.remarkModalData}
            </DialogContent>
            </Dialog>
            <Dialog 
             open={this.state.editModalOpen}
             classes={{paper:classes.dialogPaper}}
            >
            <DialogTitle className={classes.dialogTitle} disableTypography> 
                <Typography variant="h6">
                   Update the Task
                </Typography>
                <IconButton onClick={this.handleEditModal}>
                <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
               <form autoComplete="off">
                    <Grid container justify="center" spacing={2}>
                        <Grid item xs={12} sm={12} md={6}>
                            <FormControl style={{width:'100%'}}>
                                <InputLabel>Status</InputLabel>
                                <Select 
                                 value={this.state.status}
                                 onChange={this.handleChange('status')}
                                 
                                >
                                <MenuItem value='none'>Pending</MenuItem>
                                <MenuItem value='done'>Completed</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
                        <TextField 
                        label="COST"
                        id="cost"
                        type="number"
                        value={this.state.cost}
                        variant="standard"
                        onChange={this.handleChange('cost')}
                        style={{width:"100%"}}
                        />
                        </Grid>
                    </Grid>
                </form>
                        
            </DialogContent>

            <DialogActions className={classes.footerModal}>
            <Button color="default" onClick={this.handleEditModal} className={classes.buttonWidth} variant="contained">
                Cancel
            </Button>
            <Button color="primary" onClick={this.handleSubmit} className={classes.buttonWidth} variant="contained">
                Submit
            </Button>
        </DialogActions>

            
            </Dialog>
            </React.Fragment>

        )
    }
}

export default withStyles(useStyles)(TableData);