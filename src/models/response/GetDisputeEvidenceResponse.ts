import {
    GetDisputeEvidenceResponseType
} from "../../index";

/**
 *
 *
 * @export
 * @class GetDisputeEvidence
 */
export class GetDisputeEvidenceResponse {
    public proof_of_delivery_or_service_file: string;
    public proof_of_delivery_or_service_text: string;
    public proof_of_delivery_or_service_date_text: string;

    constructor(response: GetDisputeEvidenceResponseType) {
        this.proof_of_delivery_or_service_file = response.proof_of_delivery_or_service_file;
        this.proof_of_delivery_or_service_text = response.proof_of_delivery_or_service_text;
        this.proof_of_delivery_or_service_date_text = response.proof_of_delivery_or_service_date_text;
    }
}

