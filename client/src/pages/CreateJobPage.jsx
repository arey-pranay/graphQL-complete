import { useState } from "react";
import { useNavigate } from "react-router";
import { useCreateJob } from "../lib/graphql/hooks";
function CreateJobPage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { createJob, loading } = useCreateJob();
    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        try {
            const job = await createJob(title, description);
            navigate(`/jobs/${job.id}`);
        } catch (error) {
            let message = "error message";

            if (error.response?.errors?.length) {
                message = error.response.errors[0].message;
            } else if (error.message) {
                message = error.message;
            }
            setError(message);
        }
    };

    return (
        <div>
            <h1 className="title">New Job</h1>
            <div className="box">
                <form>
                    <div className="field">
                        <label className="label">Title</label>
                        <div className="control">
                            <input
                                className="input"
                                type="text"
                                value={title}
                                onChange={(event) =>
                                    setTitle(event.target.value)
                                }
                            />
                        </div>
                    </div>
                    <div className="field">
                        <label className="label">Description</label>
                        <div className="control">
                            <textarea
                                className="textarea"
                                rows={10}
                                value={description}
                                onChange={(event) =>
                                    setDescription(event.target.value)
                                }
                            />
                        </div>
                    </div>
                    <div className="field">
                        <div className="control">
                            <button
                                className="button is-link"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            {error && <h4>{error}</h4>}
        </div>
    );
}

export default CreateJobPage;
