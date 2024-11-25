package com.portfolio.controller.auth;

import com.portfolio.dto.auth.PaginatedUsers;
import com.portfolio.model.auth.AuthUser;
import com.portfolio.model.auth.User;
import com.portfolio.service.auth.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/user")
    @PreAuthorize("hasRole('admin:read')")
    public ResponseEntity<PaginatedUsers> getAllUsers(@RequestParam("page") Integer page,
                                                      @RequestParam("page-size") Integer pageSize){
        return new ResponseEntity<>(userService.getUsers(page,pageSize), OK);
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('admin:read')")
    public ResponseEntity<PaginatedUsers> searchUsers(@RequestParam("page") Integer page,
                                                      @RequestParam("page-size") Integer pageSize,
                                                      @RequestParam("browse") String browse){
        return new ResponseEntity<>(userService.searchUsers(page,pageSize,browse), OK);
    }

    @PutMapping("/user")
    @PreAuthorize("hasAnyRole('admin:update','user:update')")
    public ResponseEntity<AuthUser> updateUser(@RequestBody User user){
        return new ResponseEntity<>(userService.updateUser(user),OK);
    }

    @DeleteMapping("/user/{id}")
    @PreAuthorize("hasRole('user:delete')")
    public ResponseEntity<String> deleteUser(@PathVariable("id")Long id){
        return new ResponseEntity<>(userService.deleteUser(id),OK);
    }
}
