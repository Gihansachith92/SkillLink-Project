package com.gihan.skilllinkbackend.repository;

import com.gihan.skilllinkbackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    List<User> findByIdNot(Long currentUserId);

    @Query("SELECT DISTINCT u FROM User u JOIN u.skillsOffered s WHERE u.id != :currentUserId AND LOWER(s) LIKE LOWER(CONCAT('%', :skill, '%'))")
    List<User> searchBySkill(@Param("currentUserId") Long currentUserId, @Param("skill") String skill);

}
