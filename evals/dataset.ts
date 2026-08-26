// evals/dataset.ts
export type EvalCase = {
    id: string;
    repo: string;
    question: string;
    expectedShas?: string[]; // ≥1 must appear in top-k retrieval
    mustContain?: string[]; // case-insensitive substrings in the answer
    shouldRefuse?: boolean; // must admit it doesn't know
};

export const CASES: EvalCase[] = [
    // ---------- editions ----------
    {
        id: "ed-01",
        repo: "maran-t/editions",
        question: "How is the mock API server set up?",
        expectedShas: ["70821d2"],
        mustContain: ["swagger", "json-server"],
    },

    {
        id: "ed-02",
        repo: "maran-t/editions",
        question: "How is cart state managed?",
        expectedShas: ["3d316ac", "3d30611", "ab06d83"],
        mustContain: ["reducer"],
    },

    {
        id: "ed-03",
        repo: "maran-t/editions",
        question: "When was the product detail page added?",
        expectedShas: ["e74dfa0"],
        mustContain: ["2026"],
    },

    {
        id: "ed-04",
        repo: "maran-t/editions",
        question: "Was the default Vite README ever replaced?",
        expectedShas: ["9ef6462"],
        mustContain: ["readme"],
    },

    {
        id: "ed-05",
        repo: "maran-t/editions",
        question: "Was the project structure ever reorganised?",
        expectedShas: ["c29dbf0"],
        mustContain: ["api"],
    },

    {
        id: "ed-06",
        repo: "maran-t/editions",
        question: "What React context providers exist?",
        expectedShas: ["221eead", "26bc13d"],
        mustContain: ["product"],
    },

    // ---------- task-ease ----------
    {
        id: "te-01",
        repo: "maran-t/task-ease",
        question: "How was drag and drop implemented?",
        expectedShas: ["a6684e5"],
        mustContain: ["cdk"],
    },

    {
        id: "te-02",
        repo: "maran-t/task-ease",
        question: "Did an AI agent contribute to this repo?",
        expectedShas: ["a6684e5"],
        mustContain: ["jules"],
    },

    {
        id: "te-03",
        repo: "maran-t/task-ease",
        question: "Was NgRx ever removed?",
        expectedShas: ["906e46d"],
        mustContain: ["reducer", "selector"],
    },

    {
        id: "te-04",
        repo: "maran-t/task-ease",
        question: "What are the columns on the board?",
        expectedShas: ["a6684e5"],
        mustContain: ["progress"],
    },

    {
        id: "te-05",
        repo: "maran-t/task-ease",
        question: "Which CSS framework is used?",
        expectedShas: ["a6684e5"],
        mustContain: ["tailwind"],
    },

    {
        id: "te-06",
        repo: "maran-t/task-ease",
        question: "Were any AI coding tools used for design work?",
        expectedShas: ["d385ca2", "f408215"],
        mustContain: ["windsurf"],
    },

    // ---------- newtab-extension ----------
    {
        id: "nt-01",
        repo: "maran-t/newtab-extension",
        question: "What happened with the mouse trail feature?",
        expectedShas: ["d212e82", "937a366", "16cf7cf", "7c711d5"],
        mustContain: ["revert"],
    },

    {
        id: "nt-02",
        repo: "maran-t/newtab-extension",
        question: "Is there anything that visualises how much of the year has passed?",
        expectedShas: ["9a714b3"],
        mustContain: ["52", "week"],
    },

    {
        id: "nt-03",
        repo: "maran-t/newtab-extension",
        question: "Can users run timed focus sessions?",
        expectedShas: ["b4aaf21"],
        mustContain: ["25"],
    },

    {
        id: "nt-04",
        repo: "maran-t/newtab-extension",
        question: "How are site icons sourced?",
        expectedShas: ["c1eaa42"],
        mustContain: ["favicon"],
    },

    // ---------- ssh-studio ----------
    {
        id: "ss-01",
        repo: "maran-t/ssh-studio",
        question: "How are large file uploads handled?",
        expectedShas: ["898f37f"],
        mustContain: ["chunk"],
    },

    {
        id: "ss-02",
        repo: "maran-t/ssh-studio",
        question: "What transport is used for the terminal?",
        expectedShas: ["bf78c5e"],
        mustContain: ["websocket"],
    },

    {
        id: "ss-03",
        repo: "maran-t/ssh-studio",
        question: "Can editor appearance be customised?",
        expectedShas: ["033e86b", "0d06e7d"],
        mustContain: ["font"],
    },

    // ---------- negative: must refuse ----------
    {
        id: "neg-01",
        repo: "maran-t/task-ease",
        question: "What CI/CD pipeline and deployment process does this project use?",
        shouldRefuse: true,
    },
];