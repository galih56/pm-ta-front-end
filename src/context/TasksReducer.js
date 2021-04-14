
const storeDetailTask = (payload) => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    const user = JSON.parse(localStorage.getItem('user'));

    const newProjects = user.projects.map((project) => {
        if (project.id == payload.projectId) {
            project.columns = project.columns.map(column => {
                if (column.id == payload.listId) {
                    column.cards = column.cards.map((card) => {
                        if (card.id == payload.data.id) {
                            card = payload.data;
                        }
                        return card
                    });
                }
                return column;
            })
        }
        return project
    });
    user.projects = newProjects;
    localStorage.setItem("user", JSON.stringify(user));
    return { ...auth, ...user };
}

const storeChecklists = (payload) => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    const user = JSON.parse(localStorage.getItem('user'));
    const newProjects = user.projects.map((project) => {
        if (project.id == payload.projectId) {
            project.columns = project.columns.map(column => {
                if (column.id == payload.listId) {
                    column.cards = column.cards.map((card) => {
                        if (card.id == payload.taskId)
                            card.checklists = payload.data;
                        return card;
                    })
                }
                return column;
            })
        }
        return project
    });
    user.projects = newProjects;
    localStorage.setItem("user", JSON.stringify(user));
    return { ...auth, ...user };
}

const createNewTask = (payload) => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    const user = JSON.parse(localStorage.getItem('user'));

    const newProjects = user.projects.map((project) => {
        if (project.id == payload.projectId) {
            project.columns = project.columns.map(column => {
                if (column.id == payload.listId) {
                    if ('tags' in payload) {
                        payload.tags = payload.tags.map(tag => {
                            if (tag.inputNewTag) {
                                tag.title = tag.inputNewTag;
                            }
                            return tag;
                        });
                    }
                    column.cards.push(payload);
                }
                return column;
            })
        }
        return project
    });
    user.projects = newProjects;
    localStorage.setItem("user", JSON.stringify(user));
    return { ...auth, ...user };
}

const removeTask = (payload) => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    const user = JSON.parse(localStorage.getItem('user'));

    const newProjects = user.projects.map((project) => {
        if (project.id == payload.projectId) {
            project.columns = project.columns.map(column => {
                if (column.id == payload.listId) {
                    column.cards = column.cards.filter(card => {
                        if (card.id != payload.id) {
                            return card
                        }
                    });
                }
                return column;
            });
        }
        return project;
    });
    user.projects = newProjects;
    localStorage.setItem("user", JSON.stringify(user));
    return { ...auth, ...user };
}

const createNewChecklist = (payload) => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    const user = JSON.parse(localStorage.getItem('user'));

    const newProjects = user.projects.map((project) => {
        if (project.id == payload.projectId) {
            project.columns = project.columns.map((column) => {
                if (column.id == payload.listId) {
                    column.cards = column.cards.map((card) => {
                        if (card.id == payload.taskId) {
                            card.checklists.push(payload);
                        }
                        return card;
                    });
                }
                return column;
            })
        }
        return project
    });
    user.projects = newProjects;
    localStorage.setItem("user", JSON.stringify(user));
    return { ...auth, ...user };
}

const removeChecklist = (payload) => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    const user = JSON.parse(localStorage.getItem('user'));

    const newProjects = user.projects.map((project) => {
        if (project.id == payload.projectId) {
            project.columns = project.columns.map((column) => {
                if (column.id == payload.listId) {
                    column.cards = column.cards.map((card) => {
                        if (card.id == payload.taskId) {
                            card.checklists = card.checklists.filter((item) => {
                                if (item.id != payload) {
                                    return item;
                                }
                            });
                        }
                        return card;
                    });
                }
                return column;
            })
        }
        return project
    });
    user.projects = newProjects;
    localStorage.setItem("user", JSON.stringify(user));
    return { ...auth, ...user };
}
const createNewAttachments = (payload) => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    const user = JSON.parse(localStorage.getItem('user'));

    const newProjects = user.projects.map((project) => {
        if (project.id == payload.projectId) {
            project.columns = project.columns.map(column => {
                if (column.id == payload.listId) {
                    column.cards = column.cards.map((card) => {
                        if (card.id == payload.taskId) {
                            if('attachments' in card){
                                const newArr = [...card.attachments, ...payload.data];
                                card.attachments = newArr;
                            }else{
                                card.attachments = payload.data;
                            }
                        }
                        return card
                    });
                }
                return column;
            })
        }
        return project
    });
    user.projects = newProjects;
    localStorage.setItem("user", JSON.stringify(user));
    return { ...auth, ...user };
}

const removeAttachment = (payload) => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    const user = JSON.parse(localStorage.getItem('user'));

    const newProjects = user.projects.map((project) => {
        if (project.id == payload.projectId) {
            project.columns = project.columns.map((column) => {
                if (column.id == payload.listId) {
                    column.cards = column.cards.map((card) => {
                        if (card.id == payload.taskId) {
                            card.attachments = card.attachments.filter((item) => {
                                if (item.id != payload.id) return item;
                            });
                        }
                        return card;
                    });
                }
                return column;
            })
        }
        return project
    });
    user.projects = newProjects;
    localStorage.setItem("user", JSON.stringify(user));
    return { ...auth, ...user };
}

const moveCard = (payload) => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    const user = JSON.parse(localStorage.getItem('user'));
    const newProjects = user.projects.map((project) => {
        if (project.id == payload.projectId) {
            project.columns = project.columns.map((column) => {
                if (column.id == payload.listId) {
                    column.cards = column.cards.map((card) => {
                        if (card.id == payload.id) {
                            if ('tags' in payload) {
                                payload.tags = payload.tags.map(tag => {
                                    if (tag.inputNewTag) tag.title = tag.inputNewTag;
                                    return tag;
                                });
                            }
                            card = payload;
                        }
                    })
                }
                return column;
            })
        }
        return project
    });
    user.projects = newProjects;
    localStorage.setItem("user", JSON.stringify(user));
    return { ...auth, ...user };
}
export {
    storeDetailTask, storeChecklists, createNewTask, moveCard, removeTask,
    createNewChecklist, removeChecklist,
    createNewAttachments, removeAttachment
}