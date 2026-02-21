package com.gihan.skilllinkbackend.service;

import com.gihan.skilllinkbackend.model.User;
import com.gihan.skilllinkbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(User user){
        if (userRepository.findByEmail(user.getEmail()).isPresent()){
            throw new RuntimeException("Email already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public User loginUser(String email, String rawPassword){
        Optional<User> userOptional = userRepository.findByEmail(email);

        if(userOptional.isPresent()){
            User databaseUser = userOptional.get();

            if(passwordEncoder.matches(rawPassword, databaseUser.getPassword())){
                return databaseUser;
            }
        }

        throw new RuntimeException("Invalid email or password.");
    }

}
