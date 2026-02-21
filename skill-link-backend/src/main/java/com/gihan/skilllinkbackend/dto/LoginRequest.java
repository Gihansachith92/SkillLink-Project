package com.gihan.skilllinkbackend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank(message = "Email is required to log in.")
    @Email(message = "Please provide a valid email format.")
    private String email;

    @NotBlank(message = "Password is required to log in.")
    private String password;

}
