package com.gihan.skilllinkbackend.dto;

import lombok.Data;

import java.util.List;

@Data
public class UserSummaryResponse {

    private Long id;
    private String name;
    private String university;
    private String profileImageUrl;
    private String bio;
    private List<String> skillsOffered;
    private List<String> skillsWanted;

    public UserSummaryResponse(Long id, String name, String university, String profileImageUrl, String bio, List<String> skillsOffered, List<String> skillsWanted) {
        this.id = id;
        this.name = name;
        this.university = university;
        this.profileImageUrl = profileImageUrl;
        this.bio = bio;
        this.skillsOffered = skillsOffered;
        this.skillsWanted = skillsWanted;
    }

}
