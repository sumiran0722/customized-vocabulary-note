import React from "react";
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';

const styles = {
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: 'auto',  // marginLeft 사용
    }
}

class AppShell extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            toggle: false
        };
    }

    handleDrawerToggle = () => 
        this.setState({toggle: !this.state.toggle})

    render() {
        const { classes, children } = this.props;
        return (
            <div>
                <div className={classes.root}>
                    <AppBar position="static">
                        <IconButton className={classes.menuButton} color="inherit" onClick={this.handleDrawerToggle}>
                            <MenuIcon />
                        </IconButton>
                    </AppBar>
                    <Drawer open={this.state.toggle} onClose={this.handleDrawerToggle}>
                        <MenuItem onClick={this.handleDrawerToggle}>
                            <Link component={RouterLink} to="/">
                                Home
                            </Link>
                        </MenuItem>
                        <MenuItem onClick={this.handleDrawerToggle}>
                            <Link component={RouterLink} to="/Input">
                                단어장
                            </Link>
                        </MenuItem>
                        <MenuItem onClick={this.handleDrawerToggle}>
                            <Link component={RouterLink} to="/TodoList">
                                TodoList
                            </Link>
                        </MenuItem>
                    </Drawer>
                </div>
                <div id="content" style={{ margin: 'auto', marginTop: '20px' }}>
                    {children}
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(AppShell);
