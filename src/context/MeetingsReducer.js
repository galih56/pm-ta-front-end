

const storeMeetings = (payload) => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    const user = JSON.parse(localStorage.getItem('user'));

    const newProjects = user.projects.map((project) => {
        if (project.id == payload.projects_id) {
            project.meetings=[...project.meetings,...payload];
        }
        return project
    });
    user.projects = newProjects;
    localStorage.setItem("user", JSON.stringify(user));
    return { ...auth, ...user };
}

const createNewMeeting = (payload) => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    const user = JSON.parse(localStorage.getItem('user'));

    const newProjects = user.projects.map((project) => {
        if (project.id == payload.projects_id) {
            project.meetings.push(payload);
        }
        return project
    });
    user.projects = newProjects;
    localStorage.setItem("user", JSON.stringify(user));
    return { ...auth, ...user };
}

const storeDetailMeeting = (payload) => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    const user = JSON.parse(localStorage.getItem('user'));

    const newProjects = user.projects.map((project) => {
        if (project.id == payload.projects_id) {
            project.meetings.map(function(meeting){
                if(meeting.id==payload.id) return payload;
                return meeting;
            });
        }
        return project
    });
    user.projects = newProjects;
    localStorage.setItem("user", JSON.stringify(user));
    return { ...auth, ...user };
}

const removeMeeting = (payload) => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    const user = JSON.parse(localStorage.getItem('user'));

    const newProjects = user.projects.map((project) => {
        if (project.id == payload.project) {
            project.meetings = project.meetings.filter(meeting => {
                if (meeting.id != payload.id) {
                    return meeting;
                }
            });
            return project;
        }
    });
    user.projects = newProjects;
    localStorage.setItem("user", JSON.stringify(user));
    return { ...auth, ...user };
}


const updateMeeting = (payload) => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    const user = JSON.parse(localStorage.getItem('user'));
    const newProjects = user.projects.map((project) => {
        if (project.id == payload.project) {
            project.meetings = project.meetings.map((meeting) => {
                if (meeting.id == payload.id) {
                    meeting = payload;
                }
                return meeting;
            })
        }
        return project
    });
    user.projects = newProjects;
    localStorage.setItem("user", JSON.stringify(user));
    return { ...auth, ...user };
}

export { storeMeetings,createNewMeeting, storeDetailMeeting, removeMeeting, updateMeeting }