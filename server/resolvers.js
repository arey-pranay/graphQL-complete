import { getCompany } from "./db/companies.js";
import { getJob, getJobs } from "./db/jobs.js";

// the resolvers always need to match the schema, so we need to have a resolver for each field in the schema.
export const resolvers = {
    Query: {
        // when job is queried, this function will be executed and the return value will be sent back to the client as a response.
        job: (parent, args) => {
            // the "args" parameter contains the arguments passed to the query, in this case, the "id" argument.
            return getJob(args.id);
        },

        company: (parent, args) => {
            return getCompany(args.id);
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
};
