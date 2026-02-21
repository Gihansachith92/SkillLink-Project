package com.gihan.skilllinkbackend.controller;

import com.gihan.skilllinkbackend.dto.LoginRequest;
import com.gihan.skilllinkbackend.model.User;
import com.gihan.skilllinkbackend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody User user, BindingResult bindingResult){

        if(bindingResult.hasErrors()){
            String errorMessage = bindingResult.getFieldError().getDefaultMessage();
            return ResponseEntity.badRequest().body(Map.of("error", errorMessage));
        }

        try{
            User savedUser = userService.registerUser(user);
            return ResponseEntity.ok(Map.of("message", "Registration Successful! You can now log in."));
        }catch(RuntimeException e){
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody LoginRequest loginRequest, BindingResult bindingResult){

        if(bindingResult.hasErrors()){
            String errorMessage = bindingResult.getFieldError().getDefaultMessage();
            return ResponseEntity.badRequest().body(Map.of("error", errorMessage));
        }

        try{
            User user = userService.loginUser(loginRequest.getEmail(), loginRequest.getPassword());
            return ResponseEntity.ok(Map.of(
                    "message","Login Successful! Welcome back, " + user.getName() + "!"
            ));
        }catch(RuntimeException e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", e.getMessage()));
        }

    }
}
