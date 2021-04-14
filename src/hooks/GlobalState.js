import { useContext } from 'react';
import UserContext from './../context/UserContext';

const useGlobalState = () => {
    let global = useContext(UserContext);
    return global;
}

export default useGlobalState;