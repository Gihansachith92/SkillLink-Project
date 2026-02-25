package com.gihan.skilllinkbackend.service;

import com.gihan.skilllinkbackend.dto.UpdateProfileRequest;
import com.gihan.skilllinkbackend.dto.UserSummaryResponse;
import com.gihan.skilllinkbackend.model.User;
import com.gihan.skilllinkbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import static java.util.stream.Collectors.toList;

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

    public User updateUserProfile(Long userId, UpdateProfileRequest request){

        Optional<User> userOptional = userRepository.findById(userId);

        if(userOptional.isPresent()){
            User existingUser = userOptional.get();

            if(request.getBio() != null){
                existingUser.setBio(request.getBio());
            }
            if(request.getProfileImageUrl() != null){
                existingUser.setProfileImageUrl(request.getProfileImageUrl());
            }
            if(request.getSkillsOffered() != null){
                existingUser.getSkillsOffered().clear();
                existingUser.getSkillsOffered().addAll(request.getSkillsOffered());
            }
            if(request.getSkillsWanted() != null){
                existingUser.getSkillsWanted().clear();
                existingUser.getSkillsWanted().addAll(request.getSkillsWanted());
            }

            return userRepository.save(existingUser);

        }

        throw new RuntimeException("User not found in the database.");

    }

    public List<UserSummaryResponse> getFeedUsers(Long currentUserId, String skill){

        List<User> allOtherUsers;

        if(skill != null && !skill.trim().isEmpty()){
            allOtherUsers = userRepository.searchBySkill(currentUserId, skill);
        }else {
            allOtherUsers = userRepository.findByIdNot(currentUserId);
        }

        return allOtherUsers.stream().map( user -> new UserSummaryResponse(
                user.getId(),
                user.getName(),
                user.getUniversity(),
                user.getProfileImageUrl(),
                user.getBio(),
                user.getSkillsOffered(),
                user.getSkillsWanted()
                )).collect(toList());

    }

}
