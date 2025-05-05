import { Component } from 'react';
import { Box, Typography, Button, Paper, Alert, AlertTitle } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    console.error("Error caught by boundary:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    
    if (this.props.onRetry) {
      this.props.onRetry();
    } else {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ 
          p: 4, 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px'
        }}>
          <Paper elevation={3} sx={{ p: 4, maxWidth: '600px', width: '100%' }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <ErrorOutlineIcon color="error" sx={{ fontSize: 60 }} />
              <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 2 }}>
                {this.props.title || "Something went wrong"}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {this.props.message || "We're sorry, but there was an error loading this content."}
              </Typography>
            </Box>
            
            {this.state.error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                <AlertTitle>Error Details</AlertTitle>
                <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                  {this.state.error.toString()}
                </Typography>
              </Alert>
            )}
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button 
                variant="contained" 
                startIcon={<RefreshIcon />} 
                onClick={this.handleRetry}
                color="primary"
              >
                Try Again
              </Button>
            </Box>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
