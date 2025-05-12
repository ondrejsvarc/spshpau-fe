import React from 'react';
import { useParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

function CreateBudgetPage() {
    const { projectId } = useParams();
    return (
        <Container>
            <Typography variant="h4" sx={{mt: 2}}>Create budget for Project {projectId}</Typography>
            <Typography>Budget Creation UI will go here.</Typography>
        </Container>
    );
}
export default CreateBudgetPage;