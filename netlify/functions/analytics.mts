import { createApp } from "../../server/app";

export default createApp();

// Custom paths disable the default /.netlify/functions/analytics endpoint.
// Every dashboard page, asset and API request passes through server authorization.
export const config = { path: ["/dashboard", "/dashboard/*", "/api/private/*"], preferStatic: false };
