package com.gihan.skilllinkbackend.repository;

import com.gihan.skilllinkbackend.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    // Fetches comments for a specific post, oldest first (like a standard chat thread)
    List<Comment> findByPostIdOrderByCreatedAtAsc(Long postId);
}
