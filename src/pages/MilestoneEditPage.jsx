import React from 'react';
import { useParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

function MilestoneEditPage() {
    const { projectId, milestoneId } = useParams();
    return (
        <Container>
            <Typography variant="h4" sx={{mt: 2}}>Edit milestone {milestoneId} for {projectId}</Typography>
            <Typography>Edit Milestone UI will go there.</Typography>
        </Container>
    );
}
export default MilestoneEditPage;