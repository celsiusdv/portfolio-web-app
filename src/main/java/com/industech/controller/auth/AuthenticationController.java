package com.industech.controller.auth;

import com.industech.dto.auth.LoginRequest;
import com.industech.dto.auth.LoginResponse;
import com.industech.model.auth.User;
import com.industech.service.auth.AuthenticationService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
public class AuthenticationController {
    @Autowired
    private AuthenticationService authenticationService;


    @PostMapping("/signup")
    public ResponseEntity<User> signUp(@RequestBody User user) {
        return new ResponseEntity<>(
                authenticationService.registerUser(
                        user.getName(), user.getEmail(), user.getPassword()),
                HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> logIn(@RequestBody LoginRequest user, HttpServletResponse response) {
        return new ResponseEntity<>(
                authenticationService.login(
                        user.email(), user.password(), response),
                HttpStatus.OK);
    }
    @PostMapping("/refresh-token")
    public ResponseEntity<LoginResponse>refreshToken(@CookieValue(name = "refreshToken") String refreshToken){
        return new ResponseEntity<>( authenticationService.refreshToken(refreshToken),HttpStatus.OK );
    }

    //change hasAuthority to hasRole if the role contains ROLE_ prefix
    @PreAuthorize("hasAuthority('admin')")
    @GetMapping("/testadmin")
    public String testAdmin(){
        return "login endpoint for role admin tested successfully";
    }

    @PreAuthorize("hasRole('user')")
    @GetMapping("/testuser")
    public String testUser(){
        return "login endpoint for role user tested successfully";
    }

}