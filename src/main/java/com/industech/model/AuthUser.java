package com.industech.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Set;

@Slf4j
public class AuthUser implements UserDetails {

    private final User user;

    public AuthUser(User user) { this.user = user; }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        //list of mapped users from database to set in SimpleGrantedAuthority
        Set<Role> roles = user.getRoles();
        List<GrantedAuthority> authorities = new ArrayList<>();
        //merge the parent list of roles with the child list of privileges
        roles.forEach(role ->{
            authorities.add(new SimpleGrantedAuthority(role.getName()));
            authorities.addAll(role.getPrivileges()
                    .stream()
                    .map(privilege ->
                            new SimpleGrantedAuthority(
                                    role.getName()+":"+privilege.getName()))
                    .toList());
        });
        return authorities;
    }

    public Long getId() {return user.getId();}
    @Override
    public String getUsername() {return user.getEmail();}
    @Override @JsonIgnore
    public String getPassword() {return user.getPassword();}
    @JsonIgnore
    public User getUser(){ return user; }

    @Override @JsonIgnore public boolean isAccountNonExpired() {return true;}
    @Override @JsonIgnore public boolean isAccountNonLocked() {return true;}
    @Override @JsonIgnore public boolean isCredentialsNonExpired() {return true;}
    @Override @JsonIgnore public boolean isEnabled() {return true;}

    @Override
    public String toString() {
        return "AuthUser {"+
                "\n\tid: "+user.getId()+
                "\n\temail: "+getUsername()+
                "\n\troles: "+getAuthorities()+
                "\n}";
    }
}
