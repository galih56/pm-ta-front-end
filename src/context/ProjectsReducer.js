
const storeProjects = (state, payload) => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    const user = JSON.parse(localStorage.getItem('user'));

    user.projects = payload;
    localStorage.setItem("user", JSON.stringify(user));
    return { ...auth, ...user };
}

const storeDetailProject = (payload) => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    const user = JSON.parse(localStorage.getItem('user'));

    const newProjects = user.projects.map((project) => {
        if (project.id == payload.id) {
            project = payload;
        }
        return project
    });
    user.projects = newProjects;
    localStorage.setItem("user", JSON.stringify(user));
    return { ...auth, ...user };
}

const createNewProject = (payload) => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    const user = JSON.parse(localStorage.getItem('user'));
    user.projects.push(payload);
    localStorage.setItem("user", JSON.stringify(user));
    return { ...auth, ...user };
}

const removeProject = (payload) => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    const user = JSON.parse(localStorage.getItem('user'));

    const newProjects = user.projects.filter((project) => {
        if (project.id != payload.projectId) {
            return project;
        }
    });
    user.projects = newProjects;
    localStorage.setItem("user", JSON.stringify(user));
    return { ...auth, ...user };
}

export { storeProjects, storeDetailProject, createNewProject, removeProject }