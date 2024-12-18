import { Alert } from '@mui/material';
const ErrorReports = ({props})=>{
    return(
        <Alert severity="error">{props}</Alert>
    );
};

export default ErrorReports;