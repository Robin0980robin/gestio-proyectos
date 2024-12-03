export const usersStorage = {
    getUsers: () => {
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : [];
    },

    saveUser: (userData) => {
        const users = usersStorage.getUsers();

        if (users.some(user => user.email === userData.email)) {
            return {
                status: false,
                message: "Ya existe un usuario con el email indicado"
            }
        }

        const newUser = {
            ...userData,
            id: users.length,
            courses: []
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        return {
            status: true,
            user: newUser
        }
    },

    loginUser: (email, password) => {
        const users = usersStorage.getUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            return {
                status: false,
                message: "Credenciales inválidas"
            }
        }

        return {
            status: true,
            user
        }
    },

    updateUser: (userId, updateData) => {
        const users = usersStorage.getUsers();
        const userIndex = users.findIndex(user => user.id === userId);

        if (userIndex === -1) {
            return {
                status: false,
                message: "Usuario no encontrado"
            }
        }

        if (updateData.email && updateData.email !== users[userIndex].email) {
            const emailExists = users.some(
                (user, index) => index !== userIndex && user.email === updateData.email
            );

            if (emailExists) {
                return {
                    status: false,
                    message: "Ya existe un usuario con el email indicado"
                }
            }
        }

        const updatedUser = {
            ...users[userIndex],
            ...updateData
        };
        users[userIndex] = updatedUser;

        localStorage.setItem('users', JSON.stringify(users));

        return {
            status: true,
            user: updatedUser
        }
    }
};