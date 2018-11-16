import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';

/*const styles = theme => ({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    paper: {
      width: '80%',
      maxHeight: 435,
    },
  });*/
  

class ConfirmationDialog extends React.Component {
    constructor(props) {
      super();
      this.state = {
        
      };
      this.handleCancel = this.handleCancel.bind(this);
      this.handleOk = this.handleOk.bind(this);
    }
  
    // TODO
    componentWillReceiveProps(nextProps) {
    }
  
    handleCancel() {
      this.props.onClose(false);
    };
  
    handleOk() {
      this.props.onClose(true);
    };
  
    render() {
      const { open, classes } = this.props;
        const styles = {
            root: {
              width: '100%',
              maxWidth: 360,
              
            },
            paper: {
              width: '80%',
              maxHeight: 435,
            },
          };
      return (
        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          maxWidth="xs"
          aria-labelledby="confirmation-dialog-title"
          open={open}
          style={styles}
        >
          <DialogTitle id="confirmation-dialog-title">{this.props.title}</DialogTitle>
          <DialogContent>
            {this.props.text}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCancel} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleOk} color="primary">
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      );
    }
  }
  
  ConfirmationDialog.propTypes = {
    onClose: PropTypes.func,
  };
  //export default withStyles(styles)(ConfirmationDialog);
  export default ConfirmationDialog;