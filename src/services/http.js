import { API_VERSION_HEADER, REQUEST_ID_HEADER } from "../config";
const http = async (fetch, config, request) => {
    try {
        const response = await fetch(request.url, {
            method: request.method,
            timeout: config.timeout,
            body: JSON.stringify(request.body),
            headers: {
                ...request.headers,
                "Content-Type": "application/json",
                "Cache-Control": "no-cache",
                pragma: "no-cache"
            }
        });

        // For 'no body' response, replace with empty object
        const bodyParser = response => {
            return response.text().then(function(text) {
                return text ? JSON.parse(text) : {};
            });
        };

        if (!response.ok) {
            const json = bodyParser(response);
            throw { status: response.status, json };
        }

        return response
            .json()
            .then(data => {
                // Return CKO response headers when available
                if (REQUEST_ID_HEADER in response.headers.raw()) {
                    if (request.method === "get") {
                        return {
                            status: response.status,
                            json: data
                        };
                    }
                    return {
                        status: response.status,
                        json: data,
                        headers: {
                            "cko-request-id": response.headers.raw()[
                                REQUEST_ID_HEADER
                            ][0],
                            "cko-version": response.headers.raw()[
                                API_VERSION_HEADER
                            ][0]
                        }
                    };
                } else {
                    return {
                        status: response.status,
                        json: data
                    };
                }
            })
            .catch(err => {
                return { status: response.status, json: {} };
            });
    } catch (err) {
        throw err;
    }
};
export default http;
