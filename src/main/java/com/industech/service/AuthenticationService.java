package com.industech.service;

import com.industech.dto.LoginResponse;
import com.industech.dto.Token;
import com.industech.exception.AuthUserException;
import com.industech.exception.TokenException;
import com.industech.model.*;
import com.industech.repository.PrivilegeRepository;
import com.industech.repository.RoleRepository;
import com.industech.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Slf4j
@Service
public class AuthenticationService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private PrivilegeRepository privilegeRepository;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TokenService tokenService;


    private Set<Role> roles(String roleName){
        Set<Privilege>privileges=new HashSet<>(privilegeRepository.getUserPermissions());
        Set<Role> roles=new HashSet<>();
        Optional<Role> role= roleRepository.findByRoleName(roleName);
        if(role.isPresent()){
            role.get().setPrivileges(privileges);
            roles.add(role.get());
        }
        return roles;
    }

    public User registerUser(String name, String email, String password) {
        Optional<User> existingUser = userRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            log.error("\u001B[31memail is already in use.\u001B[0m");
            throw new AuthUserException("This email is already in use.");
        } else {
            User recordUser = new User(name, email, passwordEncoder.encode(password), roles("user"));
            return userRepository.save(recordUser);
        }
    }

    public LoginResponse login(String username, String password){
        AuthUser user= null;
        String accessToken= null;
        RefreshToken refreshToken=null;
        try {
            Authentication auth =//Authenticate the user for the ProviderManager in SecurityConfig.class, @Bean AuthenticationManager
                    authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
            if(auth.isAuthenticated()){
                user= (AuthUser) auth.getPrincipal();//the principal is set in UserDetailsServiceImpl.class
                accessToken=tokenService.createJwtAccessToken(user);
                refreshToken=tokenService.createUUIDRefreshToken(user.getUser());
                log.info("\u001B[96mauthenticated user:\n"+ user+"\u001B[0m");
            }
            return new LoginResponse(user,accessToken,refreshToken.getToken());
        }catch (AuthenticationException e) {
            log.error("\u001B[31minvalid user.\u001B[0m");
            throw new AuthUserException("Invalid User");
        }
    }

    public Token refreshToken(String refreshTokenRequest) {

        return tokenService.findRefreshToken(refreshTokenRequest)
                .map(tokenService::verifyExpiration)//returns a token, or an exception if it has expired
                .map(RefreshToken::getUser)//get the user of the refresh token from above
                .map(user ->{
                    String accessToken=tokenService.createJwtAccessToken(new AuthUser(user));
                    log.info("\u001B[35mgenerated new access token: " + accessToken + "\u001B[0m");//delete after
                    return new Token(accessToken, refreshTokenRequest);
                })
                .orElseThrow(() -> {
                    log.error("\u001B[31minvalid token or user is null.\u001B[0m");
                    return new TokenException("invalid token or user is null");
                });
    }
}