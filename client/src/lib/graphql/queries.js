// create client side queries to fetch the current user's profile information
import { gql, GraphQLClient } from "graphql-request";
const client = new GraphQLClient("http://localhost:9000/graphql");

export async function getJobs() {
    const query = gql`
        # this is the same query we were using in the sandbox at 9000/graphql, but now we are using it in our client side code to fetch the data from the server.
        query {
            jobs {
                id
                title
                date
                company {
                    id
                    name
                }
            }
        }
    `;
    const response = await client.request(query);
    return response.jobs;
}

export async function getJob(id) {
    const query = gql`
        query ($id: ID!) {
            job(id: $id) {
                id
                title
                description
                date
                company {
                    id
                    name
                }
            }
        }
    `;
    const response = await client.request(query, { id });
    return response.job;
}

export async function getCompany(id) {
    const query = gql`
        query ($id: ID!) {
            company(id: $id) {
                id
                name
                description
            }
        }
    `;
    const response = await client.request(query, { id });
    return response.company;
}
