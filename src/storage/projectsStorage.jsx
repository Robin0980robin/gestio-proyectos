export const projectsStorage = {
    // Configuración
    MAX_FILE_SIZE: 2 * 1024 * 1024, // 2MB en bytes
    ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'application/pdf'],

    // Función auxiliar para convertir archivo a Base64
    fileToBase64: (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    },

    // Validar archivo
    validateFile: (file) => {
        if (!file) {
            return { isValid: false, error: 'No se ha proporcionado ningún archivo' };
        }

        if (file.size > projectsStorage.MAX_FILE_SIZE) {
            return {
                isValid: false,
                error: `El archivo excede el tamaño máximo permitido de ${projectsStorage.MAX_FILE_SIZE / (1024 * 1024)}MB`
            };
        }

        if (!projectsStorage.ALLOWED_FILE_TYPES.includes(file.type)) {
            return {
                isValid: false,
                error: 'Tipo de archivo no permitido. Formatos permitidos: ' +
                      projectsStorage.ALLOWED_FILE_TYPES.join(', ')
            };
        }

        return { isValid: true };
    },

    getProjects: () => {
        const projects = localStorage.getItem('projects');
        return projects ? JSON.parse(projects) : [];
    },

    saveProject: async (projectData, file = null) => {
        try {
            const projects = projectsStorage.getProjects();

            let fileData = null;
            if (file) {
                const validation = projectsStorage.validateFile(file);
                if (!validation.isValid) {
                    return {
                        status: false,
                        message: validation.error
                    };
                }
                fileData = {
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    data: await projectsStorage.fileToBase64(file)
                };
            }
            console.log('filedata', fileData)
            const newProject = {
                ...projectData,
                file: fileData,
                id: projects.length,
            };

            projects.push(newProject);

            try {
                localStorage.setItem('projects', JSON.stringify(projects));
            } catch (e) {
                if (e.name === 'QuotaExceededError') {
                    return {
                        status: false,
                        message: 'No hay suficiente espacio en localStorage'
                    };
                }
                throw e;
            }

            return {
                status: true,
                project: newProject
            };
        } catch (error) {
            return {
                status: false,
                message: 'Error al guardar el proyecto: ' + error.message
            };
        }
    },

    updateProject: async (projectId, updateData, newFile = null) => {
        try {
            const projects = projectsStorage.getProjects();
            const projectIndex = projects.findIndex(project => project.id === projectId);

            if (projectIndex === -1) {
                return {
                    status: false,
                    message: "Proyecto no encontrado"
                };
            }

            // Procesar nuevo archivo si existe
            let fileData = projects[projectIndex].file;
            if (newFile) {
                const validation = projectsStorage.validateFile(newFile);
                if (!validation.isValid) {
                    return {
                        status: false,
                        message: validation.error
                    };
                }
                fileData = {
                    name: newFile.name,
                    type: newFile.type,
                    size: newFile.size,
                    data: await projectsStorage.fileToBase64(newFile)
                };
            }

            const updatedProject = {
                ...projects[projectIndex],
                ...updateData,
                file: fileData
            };

            projects[projectIndex] = updatedProject;

            try {
                localStorage.setItem('projects', JSON.stringify(projects));
            } catch (e) {
                if (e.name === 'QuotaExceededError') {
                    return {
                        status: false,
                        message: 'No hay suficiente espacio en localStorage'
                    };
                }
                throw e;
            }

            return {
                status: true,
                project: updatedProject
            };
        } catch (error) {
            return {
                status: false,
                message: 'Error al actualizar el proyecto: ' + error.message
            };
        }
    },

    deleteProject: (projectId) => {
        const projects = projectsStorage.getProjects();
        const projectIndex = projects.findIndex(project => project.id === projectId);

        if (projectIndex === -1) {
            return {
                status: false,
                message: "Proyecto no encontrado"
            };
        }

        projects.splice(projectIndex, 1);

        const updatedProjects = projects.map((project, index) => ({
            ...project,
            id: index
        }));

        localStorage.setItem('projects', JSON.stringify(updatedProjects));

        return {
            status: true,
            message: "Proyecto eliminado exitosamente"
        };
    },

    // Obtener URL del archivo para visualización
    getFileUrl: (projectId) => {
        const projects = projectsStorage.getProjects();
        const project = projects.find(p => p.id === projectId);

        if (!project || !project.file) {
            return null;
        }

        return project.file.data;
    }
};