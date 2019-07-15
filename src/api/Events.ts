import {
    HttpConfigurationType,
    Http,
    RetriveWebhookResponse,
    Environment,
    DEFAULT_TIMEOUT
} from "../index";
import { determineError } from "../utils/ErrorHandler";
import BaseEndpoint from "./BaseEndpoint";
import { EventTypesResponse, RetriveEventsResponse, RetriveEventResponse, RetriveEventNotification } from "../models/response";
import { RetrieveEventsParams } from "../models/types/Types";

export default class Events extends BaseEndpoint {

    constructor(
        key: string,
        http_options: HttpConfigurationType = {
            timeout: DEFAULT_TIMEOUT, environment: Environment.Sandbox
        }
    ) {
        super(key, http_options);
    }

    public retrieveEventTypes = async (version?: string): Promise<EventTypesResponse> => {
        try {
            const getEvents = await this._getHandler(`${this.httpConfiguration.environment}/event-types?version=${version}`);
            return new EventTypesResponse(await getEvents.json);
        } catch (err) {
            throw await determineError(err);
        }
    };

    public retrieveEvents = async (arg?: RetrieveEventsParams): Promise<RetriveEventsResponse> => {
        try {
            // build query params
            let queryParams = '';
            if (arg) {
                for (let [key, value] of Object.entries(arg)) {
                    queryParams += `?${key}=${value}`;
                }
            }
            const getEvents = await this._getHandler(`${this.httpConfiguration.environment}/events${queryParams}`);
            return new RetriveEventsResponse(await getEvents.json);
        } catch (err) {
            throw await determineError(err);
        }
    };

    public retrieveEvent = async (id: string): Promise<RetriveEventResponse> => {
        try {
            const getEvents = await this._getHandler(`${this.httpConfiguration.environment}/events/${id}`);
            return new RetriveEventResponse(await getEvents.json);
        } catch (err) {
            throw await determineError(err);
        }
    };

    public retrieveEventNotification = async (eventId: string, notificationId: string): Promise<RetriveEventNotification> => {
        try {
            const getEvents = await this._getHandler(`${this.httpConfiguration.environment}/events/${eventId}/notifications/${notificationId}`);
            return new RetriveEventNotification(await getEvents.json);
        } catch (err) {
            throw await determineError(err);
        }
    };

    public retry = async (eventId: string) => {
        const http = new Http(this.httpConfiguration);
        try {
            const response = await http.send({
                method: "post",
                url: `${this.httpConfiguration.environment}/events/${eventId}/webhooks/retry`,
                headers: {
                    Authorization: this.key,
                }
            });
        } catch (err) {
            throw await determineError(err);
        }
    };

    private _getHandler = async (
        url: string,
    ): Promise<any> => {
        const http = new Http(this.httpConfiguration);
        return http.send({
            method: "get",
            url,
            headers: {
                Authorization: this.key
            },
        });
    }
}
