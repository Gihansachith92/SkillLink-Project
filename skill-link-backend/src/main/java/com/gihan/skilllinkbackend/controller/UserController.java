package com.gihan.skilllinkbackend.controller;

import com.gihan.skilllinkbackend.dto.UpdateProfileRequest;
import com.gihan.skilllinkbackend.dto.UserSummaryResponse;
import com.gihan.skilllinkbackend.model.User;
import com.gihan.skilllinkbackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

    @Autowired
    private UserService userService;

    @PutMapping("/{id}/profile")
    public ResponseEntity<?> updateProfile(@PathVariable  Long id, @RequestBody UpdateProfileRequest request){
        try{
            User updatedUser = userService.updateUserProfile(id,request);

            return ResponseEntity.ok(Map.of(
                    "message", "Profile updated successfully!",
                    "user", updatedUser
            ));
        }catch (RuntimeException e){
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }

    }


    @GetMapping("/feed")
    public ResponseEntity<List<UserSummaryResponse>> getDashboardFeed(@RequestParam Long currentUserId, @RequestParam(required = false) String skill){
        try{
            List<UserSummaryResponse> feed = userService.getFeedUsers(currentUserId, skill);
            return ResponseEntity.ok(feed);
        }catch (Exception e){
            return ResponseEntity.badRequest().build();
        }
    }

    // GET A SINGLE USER'S FULL PROFILE
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserProfile(@PathVariable Long id){
        try{
            User user = userService.getUserById(id);

            return ResponseEntity.ok(Map.of(
                    "id", user.getId(),
                    "name", user.getName(),
                    "email", user.getEmail(),
                    "university", user.getUniversity(),
                    "bio", user.getBio() != null ? user.getBio() : "",
                    "profileImageUrl", user.getProfileImageUrl() != null ? user.getProfileImageUrl() : "",
                    "skillsOffered", user.getSkillsOffered(),
                    "skillsWanted", user.getSkillsWanted()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

}
