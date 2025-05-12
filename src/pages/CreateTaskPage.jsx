import React from 'react';
import { useParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

function CreateTaskPage() {
    const { projectId } = useParams();
    return (
        <Container>
            <Typography variant="h4" sx={{mt: 2}}>Create task for Project {projectId}</Typography>
            <Typography>Task Creation UI will go here.</Typography>
        </Container>
    );
}
export default CreateTaskPage;