import { useState, useEffect } from 'react';
import { Typography } from '@mui/material';

function TimeAgo({ date }) {
  const [timeAgo, setTimeAgo] = useState('');
  
  useEffect(() => {
    const updateTimeAgo = () => {
      if (!date) return setTimeAgo('');
      
      const targetDate = date instanceof Date ? date : new Date(date);
      const now = new Date();
      
      if (isNaN(targetDate.getTime())) {
        return setTimeAgo('Invalid date');
      }
      
      const secondsAgo = Math.floor((now - targetDate) / 1000);
      
      if (secondsAgo < 60) {
        setTimeAgo(`${secondsAgo} second${secondsAgo !== 1 ? 's' : ''} ago`);
      } else if (secondsAgo < 3600) {
        const minutes = Math.floor(secondsAgo / 60);
        setTimeAgo(`${minutes} minute${minutes !== 1 ? 's' : ''} ago`);
      } else if (secondsAgo < 86400) {
        const hours = Math.floor(secondsAgo / 3600);
        setTimeAgo(`${hours} hour${hours !== 1 ? 's' : ''} ago`);
      } else if (secondsAgo < 604800) {
        const days = Math.floor(secondsAgo / 86400);
        setTimeAgo(`${days} day${days !== 1 ? 's' : ''} ago`);
      } else if (secondsAgo < 2592000) {
        const weeks = Math.floor(secondsAgo / 604800);
        setTimeAgo(`${weeks} week${weeks !== 1 ? 's' : ''} ago`);
      } else if (secondsAgo < 31536000) {
        const months = Math.floor(secondsAgo / 2592000);
        setTimeAgo(`${months} month${months !== 1 ? 's' : ''} ago`);
      } else {
        const years = Math.floor(secondsAgo / 31536000);
        setTimeAgo(`${years} year${years !== 1 ? 's' : ''} ago`);
      }
    };
    
    updateTimeAgo();
    
    const interval = setInterval(updateTimeAgo, 60000);
    
    return () => clearInterval(interval);
  }, [date]);
  
  return (
    <Typography component="span" variant="body2" color="text.secondary">
      {timeAgo}
    </Typography>
  );
}

export default TimeAgo;
