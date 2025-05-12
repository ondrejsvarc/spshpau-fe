import React from 'react';
import { useParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

function ManageCollaboratorsPage() {
    const { projectId } = useParams();
    return (
        <Container>
            <Typography variant="h4" sx={{mt: 2}}>Manage Collaborators for Project {projectId}</Typography>
            <Typography>Collaborator management UI will go here.</Typography>
        </Container>
    );
}
export default ManageCollaboratorsPage;