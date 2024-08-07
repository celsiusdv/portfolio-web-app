import { Button, Checkbox, FormControl, FormErrorMessage, FormHelperText, FormLabel, Input, Spinner } from "@chakra-ui/react";
import classes from './authentication.module.css';
import { FormEvent, useContext, useEffect, useState } from "react";
import axios from "axios";
import AuthContext from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const authContext  = useContext<UserContext | undefined>(AuthContext);//fill the data and manage it in AuthProvider.tsx
    const navigate = useNavigate();
    const [user, setUser] = useState<User>({email:'admin@demoapp.com',password:'password'});
    const [isError, setIsError]= useState<boolean>(false)
    const [error, setError]=useState<string | undefined>(undefined);
    const disable: boolean= user.email=== '' || user.password === '';
    const [isLoading, setIsLoading]=useState(false);

    const handleSubmit = async (event:FormEvent<HTMLFormElement>) =>{
        event.preventDefault();
        setIsLoading(true); 
        try{
            const response = await axios.post<LoginResponse>("/api/v1/auth/login",
                user, {//object to send to the server
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
            });
            authContext?.setAuth(response.data);
            setIsLoading(false);
            navigate("/");
        }catch(error:unknown){
            setIsLoading(false);
            if(axios.isAxiosError(error)){
                if (error.response?.status === 401) {
                    setIsError(true);
                    setError(error.response.data.message);
                }else if (error.response?.status === 500){
                    setIsError(true);
                    setError("Error from the server");
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
            <h2>Log in</h2>
            {isLoading ? <Spinner thickness='4px'
                                            speed='0.65s' emptyColor='gray.200'
                                            color='purple.500' size='xl' />
                                        : 
            <form onSubmit={(e)=>handleSubmit(e)}>
                <FormControl as='fieldset' className={classes.form} isInvalid={isError}>
                    <div>
                        <FormLabel>Email Address</FormLabel>
                        <Input type='email' defaultValue={user.email} placeholder="Enter your email"
                            onChange={(event) => {
                                setUser({ ...user, email: event.target.value });
                                setIsError(false);
                            }} />
                        {!isError ? <FormHelperText>We will not share your data or send you spam</FormHelperText> :
                            <FormErrorMessage>{`${error}`}</FormErrorMessage>
                        }
                    </div>

                    <div>
                        <FormLabel>Password</FormLabel>
                        <Input type='password' defaultValue={user.password} placeholder="Enter your password"
                            onChange={(event) => {
                                setUser({...user,password: event.target.value});
                                setIsError(false);
                            }} />
                        
                    </div>

                    <div>
                        <Checkbox onChange={togglePersist} isChecked={authContext?.persist}
                                    colorScheme="teal" >
                            Remember account
                        </Checkbox>
                    </div>

                    <div>
                        <Button marginTop={3} type="submit" isDisabled={disable}>Log in</Button>
                    </div>
                </FormControl>
            </form>}
        </div>
    );
};

export default Login;