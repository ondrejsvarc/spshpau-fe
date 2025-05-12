import React from 'react';
import { useParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

function BudgetPage() {
    const { projectId } = useParams();
    return (
        <Container>
            <Typography variant="h4" sx={{mt: 2}}>Budget from Project {projectId}</Typography>
            <Typography>Budget Detail UI will go here.</Typography>
        </Container>
    );
}
export default BudgetPage;