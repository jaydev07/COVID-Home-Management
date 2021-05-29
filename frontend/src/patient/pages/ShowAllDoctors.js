import React,{useState,useContext, useEffect} from "react";
import {useHistory} from "react-router-dom";

import {AuthContext} from "../../shared/context/AuthContext";
import Backdrop from "../../shared/UIElements/Backdrop";
import ErrorModal from "../../shared/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";
import DoctorList from "../components/DoctorList";

const ShowAllDoctors = () => {

    const auth = useContext(AuthContext);
    const history = useHistory();
    const [isLoading , setIsLoading] = useState(false);
    const [error , setError] = useState();

    const [doctors , setDoctors] = useState();

    // To handle error
    const errorHandler = () => {
        setError(null);
    }

    useEffect(() => {
        const sendRequest = async () => {
            try{
                setIsLoading(true);
                const response = await fetch("http://localhost:8080/api/doctor/all");
                const responseData = await response.json();

                if(responseData.message){
                    throw new Error(responseData.message);
                }

                setDoctors(responseData.doctors);
            }catch(err){
                console.log(err);
                setError(err.message);
            }
            setIsLoading(false);
        }
        sendRequest();
    },[])

    return(
        <React.Fragment>
            { error && (
                <React.Fragment>
                    <Backdrop onClick={errorHandler} />
                    <ErrorModal heading="Error Occured!" error={error} />
                </React.Fragment>
            )}
            { isLoading && <LoadingSpinner asOverlay />}

            <h1>List of all the doctors</h1>

            { !isLoading && doctors && (
                <DoctorList doctors={doctors}/>
            )}
        </React.Fragment>
    );
}

export default ShowAllDoctors;