import React from 'react';
import { Dialog, DialogTitle, DialogContent, withStyles, TextField, DialogActions, Button, IconButton, Typography, Snackbar } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import MuiAlert from '@material-ui/lab/Alert';
const useStyles=theme=>({
    dialogPaper:{
        minHeight:'50vh',
        minWidth:'80vw'
    },
    footerModal:{
        display:'flex',
        justifyContent:'space-around'
    },
    buttonWidth:{
        width:'25%'
    },
    dialogTitle:{
        display:'flex',
        justifyContent:'space-between',
        alignItems:'center'
    }


});

const Alert=(props) =>{
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

class FormDialog extends React.Component{

    constructor(props)
    {
        super(props);
        this.state={

            imei:'',
            name:'',
            mobile:'',
            remark:'',
            isInvalid:false,
            alertType:'',
            alertMessage:''
        }
    }

    reset=()=>{
        this.setState({
            imei:'',
            name:'',
            mobile:'',
            remark:''
        });
    }

    handleCancel=()=>{

        this.props.onClose();

    }

    handleChange=name=>event=>{
        this.setState({
            [name]:event.target.value
        })
    }

    showAlert=(alertType,alertMessage)=>{

        this.setState({
            isInvalid:true,
            alertMessage:alertMessage,
            alertType:alertType
        });

    }

    validateFormData=()=>{
        if(this.state.imei==='' || this.state.name==='' || this.state.mobile==='' || this.state.remark==='')
            {
                this.showAlert('warning','Input Fields can\'t be empty.');
                return true;
            }
        else if(this.state.mobile.toString().length!==10)
        {
            this.showAlert('warning','Mobile No. should be of 10 digits');
            return true;
        }
        else if(this.state.imei.length<14 || this.state.imei.length>16)
        {
            this.showAlert('warning','IMEI No. should be of 14-16 digits');
            return true;
        }

        return false;

    }

    handleAlertEnd=()=>{
        this.setState({
            isInvalid:false
        });
    }

    handleSubmit=()=>{

       let err= this.validateFormData();

       if(err)
        return;

        let formdata={
            imei:this.state.imei,
            name:this.state.name,
            mobile:this.state.mobile,
            remark:this.state.remark
        }

       // console.log(formdata);

        this.props.onSubmit(formdata);

        this.reset();
        this.handleCancel();
    }

    


    render()
    {
        const {classes}=this.props;
        return(
            <React.Fragment>
            <Dialog 
             open={this.props.isOpen}
             classes={{ paper: classes.dialogPaper }}
            >
            <DialogTitle className={classes.dialogTitle} disableTypography> 
                <Typography variant="h6">
                    Create new Task
                </Typography>
                <IconButton onClick={this.handleCancel}>
                <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <form autoComplete="off">
                    <TextField 
                    label="IMEI No"
                    id="imei"
                    type="number"
                    value={this.state.imei}
                    variant="outlined"
                    onChange={this.handleChange('imei')}
                    style={{width:'48%',margin:'1%'}}
                    />
                    <TextField 
                    label="Customer Name"
                    id="name"
                    value={this.state.name}
                    variant="outlined"
                    onChange={this.handleChange('name')}
                    style={{width:'48%',margin:'1%'}}
                    />
                    <br/>
                    <TextField 
                    label="Phone Number"
                    id="mobile"
                    type="number"
                    value={this.state.mobile}
                    variant="outlined"
                    onChange={this.handleChange('mobile')}
                    style={{width:'48%',margin:'1% 0 1% 26%'}}
                    />
                    <br/>
                    <TextField 
                    label="Remarks"
                    multiline
                    id="remark"
                    rows={4}
                    value={this.state.remark}
                    variant="outlined"
                    onChange={this.handleChange('remark')}
                    style={{width:'98%',margin:'1%'}}
                    />
                    <br/>
                </form>
            </DialogContent>
            <DialogActions className={classes.footerModal}>
                <Button color="default" onClick={this.handleCancel} className={classes.buttonWidth} variant="contained">
                    Cancel
                </Button>
                <Button color="primary" onClick={this.handleSubmit} className={classes.buttonWidth} variant="contained">
                    Submit
                </Button>
            </DialogActions>
            
            </Dialog>
                <Snackbar open={this.state.isInvalid} onClose={this.handleAlertEnd} autoHideDuration={5000} anchorOrigin={{horizontal:'center',vertical:'top'}}>
                    <Alert severity={this.state.alertType} >
                    {this.state.alertMessage}
                    </Alert>
                </Snackbar>
            </React.Fragment>
        )
    }
}

export default withStyles(useStyles)(FormDialog);