import React, { useState } from "react";
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

function AppShell({ classes, children }) {
    const [toggle, setToggle] = useState(false);

    const handleDrawerToggle = () => {
        setToggle(!toggle);
    };

    return (
        <div>
            <div className={classes.root}>
                <AppBar position="static" style={{
                    display: 'flex',
                    justifyContent: 'flex-start'
                }}>
                    <IconButton className={classes.menuButton} color="inherit" onClick={handleDrawerToggle}>
                        <MenuIcon />
                    </IconButton>
                </AppBar>
                <Drawer open={toggle} onClose={handleDrawerToggle}>
                    <MenuItem onClick={handleDrawerToggle}>
                        <Link component={RouterLink} to="/">
                            Home
                        </Link>
                    </MenuItem>
                    <MenuItem onClick={handleDrawerToggle}>
                        <Link component={RouterLink} to="/Input">
                            단어장
                        </Link>
                    </MenuItem>
                    <MenuItem onClick={handleDrawerToggle}>
                        <Link component={RouterLink} to="/TodoList">
                            TodoList
                        </Link>
                    </MenuItem>
                    <MenuItem onClick={handleDrawerToggle}>
                        <Link component={RouterLink} to="/Voca">
                            Voca
                        </Link>
                    </MenuItem>
                    <MenuItem onClick={handleDrawerToggle}>
                        <Link component={RouterLink} to="CardVoca">
                            CardVoca
                        </Link>
                    </MenuItem>
                    <MenuItem onClick={handleDrawerToggle}>
                        <Link component={RouterLink} to="VocaForCard">
                            VocaForCard
                        </Link>
                    </MenuItem>
                    <MenuItem onClick={handleDrawerToggle}>
                        <Link component={RouterLink} to="/Logout">
                            Logout
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

export default withStyles(styles)(AppShell);