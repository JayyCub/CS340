import {OverlayTrigger, Tooltip} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface Props {
    displayMessage: Function
}

const OAuthFields = (props: Props) => {
    return (
        <div className="text-center mb-3">
            <button
                type="button"
                className="btn btn-link btn-floating mx-1"
                onClick={() =>
                    props.displayMessage("Google registration is not implemented.")
                }
            >
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="googleTooltip">Google</Tooltip>}
                >
                    <FontAwesomeIcon icon={["fab", "google"]}/>
                </OverlayTrigger>
            </button>

            <button
                type="button"
                className="btn btn-link btn-floating mx-1"
                onClick={() =>
                    props.displayMessage("Facebook registration is not implemented.")
                }
            >
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="facebookTooltip">Facebook</Tooltip>}
                >
                    <FontAwesomeIcon icon={["fab", "facebook"]}/>
                </OverlayTrigger>
            </button>

            <button
                type="button"
                className="btn btn-link btn-floating mx-1"
                onClick={() =>
                    props.displayMessage("Twitter registration is not implemented.")
                }
            >
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="twitterTooltip">Twitter</Tooltip>}
                >
                    <FontAwesomeIcon icon={["fab", "twitter"]}/>
                </OverlayTrigger>
            </button>

            <button
                type="button"
                className="btn btn-link btn-floating mx-1"
                onClick={() =>
                    props.displayMessage("LinkedIn registration is not implemented.")
                }
            >
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="linkedInTooltip">LinkedIn</Tooltip>}
                >
                    <FontAwesomeIcon icon={["fab", "linkedin"]}/>
                </OverlayTrigger>
            </button>

            <button
                type="button"
                className="btn btn-link btn-floating mx-1"
                onClick={() =>
                    props.displayMessage("Github registration is not implemented.")
                }
            >
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="githubTooltip">GitHub</Tooltip>}
                >
                    <FontAwesomeIcon icon={["fab", "github"]}/>
                </OverlayTrigger>
            </button>
        </div>
    )
}

export default OAuthFields