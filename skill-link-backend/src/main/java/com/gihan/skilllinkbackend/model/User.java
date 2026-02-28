package com.gihan.skilllinkbackend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotBlank(message = "Name is required and cannot be blank.")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "Email is required.")
    @Email(message = "Please provide a valid email address.")
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank(message = "Password is required.")
    @Size(min = 6, message = "Password must be at least 6 characters long.")
    @Column(nullable = false)
    private String password;

    @NotBlank(message = "University name is required.")
    private String university;

    private String profileImageUrl;

    @Column(length = 500)
    private String bio;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_skills_offered", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "skill")
    private List<String> skillsOffered = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_skills_wanted", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "skill")
    private List<String> skillsWanted = new ArrayList<>();

}
