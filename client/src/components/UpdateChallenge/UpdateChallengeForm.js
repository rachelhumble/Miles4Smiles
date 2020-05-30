import React, { useState, useRef, useContext } from "react";
import API from "../../utils/API";
import AUTH from "../../utils/AUTH";
import UserContext from "../../utils/UserContext";
import ChallengeContext from "../../utils/ChallengeContext"
import Jdenticon from "react-jdenticon";
import {Input} from "../Form";
import {Row, Col} from "../Grid"

function UpdateChallengeForm(props) {
    const { user } = useContext(UserContext);
    const {myChallenges, } = useContext(ChallengeContext)
    const [formObject, setFormObject] = useState([]);
    const challengeForm = useRef(null);


    function handleInputChange(event) {
        const { name, value } = event.target;
        setFormObject({...formObject, [name]: value})
    };

    function handleChallengeSave(event) {
        console.log("this is the guy:", props.id, props.challengers);

        event.preventDefault();
        if(formObject.loser) {
            API.updateChallenge(props.id,{donor: formObject.loser, status: "finish"})
            .then(res => {
                challengeForm.current.reset();
                props.handleChallenge();
            })
            .catch(err => {
                console.log(err);
            });
            if(formObject.loser == user.username){
                const lost = user.challengesLost + 1;
                AUTH.userUpdate(user._id, {challengesLost: lost})
                .then(res => {
                    console.log(res);
                })
                .catch(err => {
                    console.log(err);
                });
            } else {
                const won = user.challengesWon + 1;
                AUTH.userUpdate(user._id, {challengesWon: won})
                .then(res => {
                    console.log(res);
                })
                .catch(err => {
                    console.log(err);
                });
            }
        }
    }


    return (
        <>
            <form ref={challengeForm}>
                <div className="form-group text-center">
                    <label >Who lost and will donate to {props.business}?</label>
                    {/* <label htmlFor="exampleInputEmail1">Who lost and will donate to {calculatedAmount} to {props.challenges.businessName}?</label> */}
                    <br></br>
                    <Row>
                        <Col size="6">
                            <div className="radio">
                                <label>
                                <Jdenticon className="avatar" size="48" value={props.challengers[0]} float="right"></Jdenticon>
                                    <Input type="radio" value={props.challengers[0]} name="loser"  onChange={handleInputChange}/>
                                    {props.challengers[0]}
                                </label>
                            </div>
                        </Col>
                        <Col size="6">
                            <div className="radio">
                                <label>
                                <Jdenticon className="avatar" size="48" value={props.challengers[1]} float="right"></Jdenticon>

                                    <Input type="radio" value={props.challengers[1]} name="loser"  onChange={handleInputChange}/>
                                    {props.challengers[1]}
                                </label>
                            </div>
                        </Col>
                    </Row>
                        {/* <input onChange={handleInputChange} name="loser" type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"></input> */}
                    <small  className="form-text text-muted">Enter the user who ran the set distance at a slower pace.</small>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                    <button type="button" className="btn btn-success" onClick={handleChallengeSave} data-dismiss="modal">Submit challenge</button>
                </div>
            </form>
        </>
    )
}

export default UpdateChallengeForm