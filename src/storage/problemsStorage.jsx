export const problemsStorage = {
    getProblems: () => {
        const problems = localStorage.getItem('problems');
        return problems ? JSON.parse(problems) : [];
    },

    saveProblem: (problemData) => {
        const problems = problemsStorage.getProblems()

        const newProblem = {
            ...problemData,
            id: problems.length,
        };

        problems.push(newProblem)

        localStorage.setItem('problems', JSON.stringify(problems));

        return {
            status: true,
            problem: newProblem
        }
    }
};