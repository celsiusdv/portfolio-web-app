import { Button, Checkbox, FormControl, FormErrorMessage, FormHelperText, FormLabel, Input } from "@chakra-ui/react";
import classes from './authentication.module.css';
import { FormEvent, useContext, useEffect, useState } from "react";
import axios from "axios";
import AuthContext from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const authContext  = useContext<UserContext | undefined>(AuthContext);//fill the data and manage it in AuthProvider.tsx
    const navigate = useNavigate();
    const [user, setUser] = useState<User>({});
    const [isError, setIsError]= useState<boolean>(false)
    const [error, setError]=useState<string | undefined>(undefined);
    const disable: boolean= user.email=== '' || user.password === '';

    const handleSubmit = async (event:FormEvent<HTMLFormElement>) =>{
        event.preventDefault();
        try{
            const response = await axios.post<LoginResponse>("/api/v1/auth/login",
                user, {//object to send to the server
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
            });
            authContext?.setAuth(response.data);
            navigate("/");
        }catch(error:unknown){
            if(axios.isAxiosError(error)){
                if (error.response?.status === 401) {
                    setIsError(true);
                    setError(error.response.data.message);
                }else if (error.response?.status === 500){
                    setIsError(true);
                    setError("Error while trying to login");
                }
            }
        }
    };

    const togglePersist = () => authContext?.setPersist(prev => !prev);
    
    useEffect(() => {
        localStorage.setItem('persist',JSON.stringify(authContext?.persist));
    }, [authContext?.persist])

    return (
        <div className={classes.container}>
            <h2>Iniciar sesión</h2>
            <form onSubmit={(e)=>handleSubmit(e)}>
                <FormControl as='fieldset' className={classes.form} isInvalid={isError}>
                    <div>
                        <FormLabel>Dirección de Email</FormLabel>
                        <Input type='email' defaultValue={user.email} placeholder="Ingrese su email"
                            onChange={(event) => {
                                setUser({ ...user, email: event.target.value });
                                setIsError(false);
                            }} />
                        {!isError ? <FormHelperText>No compartiremos tus datos ni te enviaremos correos spam</FormHelperText> :
                            <FormErrorMessage>{`${error}`}</FormErrorMessage>
                        }
                    </div>

                    <div>
                        <FormLabel>Contraseña</FormLabel>
                        <Input type='password' defaultValue={user.password} placeholder="Ingrese su contraseña"
                            onChange={(event) => {
                                setUser({...user,password: event.target.value});
                                setIsError(false);
                            }} />
                        
                    </div>

                    <div>
                        <Checkbox onChange={togglePersist} isChecked={authContext?.persist}
                                    colorScheme="red" >
                            Recordar cuenta
                        </Checkbox>
                    </div>

                    <div>
                        <Button marginTop={3} type="submit" isDisabled={disable}>Iniciar sesión</Button>
                    </div>
                </FormControl>
            </form>
        </div>
    );
};

export default Login;