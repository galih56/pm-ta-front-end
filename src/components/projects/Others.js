import React, { Suspense,lazy } from 'react';
import Grid from '@material-ui/core/Grid';
import Overview from './Overview';

const ProjectInformations = lazy(() => import('../projects/ProjectInformations'));
const MemberList = lazy(() => import('./members/MemberList'));
const RoleList = lazy(() => import('./roles/RoleList'));
const RepositoryList = lazy(() => import('./github/RepositoryList'));

const Others = ({detailProject,handleDetailTaskOpen}) => {
    return (
        <Grid container spacing={2}>
            <Suspense>
                <Grid item xl={12} md={12} sm={12} xs={12} >
                    <ProjectInformations detailProject={detailProject} />
                </Grid>
                <Grid item xl={12} md={12} sm={12} xs={12} >
                    <Overview detailProject={detailProject} handleDetailTaskOpen={handleDetailTaskOpen}/>
                </Grid>
                <Grid item xl={7} md={7} sm={12} xs={12} >
                    <MemberList 
                        projectId={detailProject.id} 
                        data={detailProject.members} 
                        handleDetailTaskOpen={handleDetailTaskOpen} />
                </Grid>
                <Grid item xl={5} md={5} sm={12} xs={12} >
                    <RoleList projectId={detailProject.id} />
                </Grid>
                <Grid item xl={12} md={12} sm={12} xs={12}>
                    <RepositoryList projectId={detailProject.id}/>
                </Grid>
            </Suspense>
        </Grid >
    );
}

export default Others;