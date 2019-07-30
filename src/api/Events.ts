import {
    HttpConfigurationType,
    Http,
    Environment,
    EventTypesResponse,
    RetriveEventsResponse,
    RetriveEventResponse,
    RetriveEventNotification,
    RetrieveEventsParams,
    DEFAULT_TIMEOUT
} from "../index";
import { determineError } from "../utils/ErrorHandler";
import { performRequest } from "../utils/RequestHandler";

import BaseEndpoint from "./BaseEndpoint";

const querystring = require("querystring");


/**
 * Events API endpoints Class.
 *
 * @export
 * @class Events
 * @extends {BaseEndpoint}
 */
export default class Events extends BaseEndpoint {


    /**
     * Creates an instance of Events.
     * @param {string} key
     * @param {http_options} HttpConfigurationType
     * @param {HttpConfigurationType.timeout} HttpConfigurationType.timeout HTTP request timeout
     * @param {HttpConfigurationType.environment} HttpConfigurationType.environment default: Sandbox; API Environment
     * @memberof Events
     */
    constructor(
        key: string,
        http_options: HttpConfigurationType = {
            timeout: DEFAULT_TIMEOUT, environment: Environment.Sandbox
        }
    ) {
        super(key, http_options);
    }


    /**
     * Retrieves Events Types with or without a version filter.
     *
     * @param {version} string The webhook version
     * @return {Promise<EventTypesResponse>} A promise to events types response.
     * @memberof Events
     */
    public retrieveEventTypes = async (version?: string): Promise<EventTypesResponse> =>
        new EventTypesResponse(await this._getHandler(`${this.httpConfiguration.environment}/event-types?version=${version}`));

    /**
     * Retrieves Events from the Unified Payments API.
     *
     * @param {arg} RetrieveEventsParams Filters for the retrieve events query.
     *
     * @param RetrieveEventsParams.from An ISO8601 formatted date and time to search from (default = last 6 months).
     * @param RetrieveEventsParams.to An ISO8601 formatted date and time to search to (default = now).
     * @param RetrieveEventsParams.limit Default: 10; The number of events to return per page.
     * @param RetrieveEventsParams.skip Default: 0; The number of events to skip.
     * @param RetrieveEventsParams.payment_id Search for an event by Payment ID.
     * @param RetrieveEventsParams.reference Search for an event by Reference.
     *
     * @return {Promise<RetriveEventsResponse>} A promise to events response.
     * @memberof Events
     */
    public retrieveEvents = async (arg?: RetrieveEventsParams): Promise<RetriveEventsResponse> => {
        const params = querystring.stringify(arg).length > 0 ? `?${querystring.stringify(arg)}` : "";
        return new RetriveEventsResponse(await this._getHandler(`${this.httpConfiguration.environment}/events${params}`));
    };

    /**
     * Retrieves Event from the Unified Payments API.
     *
     * @param {id} string /^(evt)_(\w{26})$/ The event identifier
     * @return {Promise<RetriveEventResponse>} A promise to event response.
     * @memberof Events
     */
    public retrieveEvent = async (id: string): Promise<RetriveEventResponse> =>
        new RetriveEventResponse(await this._getHandler(`${this.httpConfiguration.environment}/events/${id}`));
    /**
     * Retrieves Event Notification from the Unified Payments API.
     *
     * @param {eventId} string /^(evt)_(\w{26})$/ The event identifier
     * @param {notificationId} string /^(ntf)_(\w{26})$/ The notification identifier
     * @return {Promise<RetriveEventResponse>} A promise to event response.
     * @memberof Events
     */
    public retrieveEventNotification = async (eventId: string, notificationId: string): Promise<RetriveEventNotification> =>
        new RetriveEventNotification(await this._getHandler(`${this.httpConfiguration.environment}/events/${eventId}/notifications/${notificationId}`));


    /**
     * Retry Webhook.
     *
     * @param {eventId} string /^(evt)_(\w{26})$/ The event identifier
     * @param {webhookId} string /^(wh)_(\w{26})$/ The webhook identifier
     * @memberof Events
     */
    public retry = async (eventId: string, webhookId: string) => {
        const http = new Http(this.httpConfiguration);
        try {
            const response = await http.send({
                method: "post",
                url: `${this.httpConfiguration.environment}/events/${eventId}/webhooks/${webhookId}/retry`,
                headers: {
                    Authorization: this.key,
                }
            });
        } catch (err) {
            throw await determineError(err);
        }
    };

    /**
     * Retry all Webhooks.
     *
     * @param {eventId} string /^(evt)_(\w{26})$/ The event identifier
     * @memberof Events
     */
    public retryAll = async (eventId: string) => {
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


    /**
     * Handle all GET requests to remove duplication
     *
     * @private
     * @memberof Payments
     */
    private _getHandler = async (
        url: string,
    ): Promise<any> =>
        performRequest({
            config: this.httpConfiguration,
            method: "get",
            url,
            headers: {
                Authorization: this.key
            },
        })

}
