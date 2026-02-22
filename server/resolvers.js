import { GraphQLError } from "graphql";
import { getCompany } from "./db/companies.js";
import {
    getJob,
    getJobs,
    getJobsByCompanyId,
    createJob,
    deleteJob,
    updateJob,
} from "./db/jobs.js";

// the resolvers always need to match the schema, so we need to have a resolver for each field in the schema.
export const resolvers = {
    Query: {
        // when job is queried, this function will be executed and the return value will be sent back to the client as a response.
        job: async (parent, args) => {
            // the "args" parameter contains the arguments passed to the query, in this case, the "id" argument.
            const job = await getJob(args.id);
            if (!job) return customNotFoundError("Job Not Found", args.id);
            return job;
        },

        company: async (parent, args) => {
            const company = await getCompany(args.id);
            if (!company)
                return customNotFoundError("Company Not Found", args.id);
            return company;
        },

        jobs: () => getJobs(),
    },
    //the date field needs to be separately resolved because in this case the DB returns "createdAt" in the ISO format, not "date"

    // this is the resolved for all the job objects for the Jobs array, whenever Job is found, the date will be resolved based on this resolver
    Job: {
        //even if later we have a date field in the DB, this function will override that response
        date: (parent) => parent.createdAt.slice(0, "yyyy-mm-dd".length), // we take the "createdAt" field from the parent object (which is the  job object) and slice it to get only the date part (YYYY-MM-DD).
        company: (parent) => getCompany(parent.companyId), // we take the "companyId" field from the parent object (which is the job object) and use it to get the company details from the database using the getCompanyById function.
    },

    // let's resolve the company field for the Job type, so that when we query for a job and ask for the company details, we can get them from the database using the companyId field in the job object.
    Company: {
        jobs: (parent) => getJobsByCompanyId(parent.id), // we take the "id" field from the parent object (which is the company object) and use it to get the jobs for that company from the database using the getJobsByCompanyId function.
    },

    // ----- This was about reading (querying), now let's tell how to write  -----

    Mutation: {
        // In a real app, you would validate the input and check if the company exists.
        // For now, we'll assume the company exists and is valid.

        // the first parameter is the parent (in this case,the root).
        // the second parameter is the object of user arguments.
        // the third parameter is the context, you can have stuff like headers and tokens etc etc
        createJobMutation: (
            parent,
            { input: { title, description, companyId } }, // nice destructuring used here to get the title, description and companyId from the input argument of the createJobMutation, which is an object that contains these fields. This way we can directly use these variables in the createJob function without having to access them through the input object.
            { auth },
        ) => {
            if (!auth) {
                throw unauthorizedError("Missing authentication");
            }
            createJob({ title, description, companyId });
        },
        deleteJobMutation: (parent, { id }) => deleteJob(id),

        updateJobMutation: (parent, { input: { id, title, description } }) =>
            updateJob({ id, title, description }),
    },
};

function customNotFoundError(message) {
    const error = new GraphQLError(message);
    error.extensions = { code: "NOT_FOUND" };
    return error;
}

function unauthorizedError(message) {
    return new GraphQLError(message, {
        extensions: { code: "UNAUTHORIZED" },
    });
}
