package com.gihan.skilllinkbackend.dto;

import lombok.Data;

import java.util.List;

@Data
public class UpdateProfileRequest {

    private String profileImageUrl;
    private String bio;
    private List<String> skillsOffered;
    private List<String> skillsWanted;
}
