import React, { memo } from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
const Footer = (props) => (
    <footer style={{ width: '100%', marginTop: '1em' }}>
        <Box pt={4}>
            <Typography variant="body2" color="textSecondary" align="center">
                {'Copyright © '}
                <Link color="inherit" href="https://www.linkedin.com/in/galih-indra-waspada-b07215127/"> Galih56 </Link>{' '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
            <noscript>
                You need to enable JavaScript to run this app.
            </noscript>
        </Box>
    </footer>
);

export default memo(Footer);
