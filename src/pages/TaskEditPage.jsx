import React from 'react';
import { useParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

function TaskEditPage() {
    const { projectId, taskId } = useParams();
    return (
        <Container>
            <Typography variant="h4" sx={{mt: 2}}>Edit task {taskId} for {projectId}</Typography>
            <Typography>EditTaskUI will go there.</Typography>
        </Container>
    );
}
export default TaskEditPage;