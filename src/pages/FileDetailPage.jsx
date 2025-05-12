import React from 'react';
import { useParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

function FileDetailPage() {
    const { projectId, fileId } = useParams();
    return (
        <Container>
            <Typography variant="h4" sx={{mt: 2}}>File detail {fileId} from Project {projectId}</Typography>
            <Typography>File Detail UI will go here.</Typography>
        </Container>
    );
}
export default FileDetailPage;