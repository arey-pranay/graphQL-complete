import { useEffect, useState } from "react";
import JobList from "../components/JobList";
import { getJobs } from "../lib/graphql/queries";

function HomePage() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function fetchJobs() {
            const jobs = await getJobs();
            setJobs(jobs);
            setLoading(false);
        }
        fetchJobs();
    }, []);

    return (
        <div>
            <h1 className="title">Job Board</h1>
            {loading ? <p>Loading...</p> : <JobList jobs={jobs} />}
        </div>
    );
}

export default HomePage;
