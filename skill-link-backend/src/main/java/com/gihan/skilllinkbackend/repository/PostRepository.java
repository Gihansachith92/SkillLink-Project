package com.gihan.skilllinkbackend.repository;

import com.gihan.skilllinkbackend.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    // This custom command tells PostgreSQL to sort the feed from newest to oldest!
    List<Post> findAllByOrderByCreatedAtDesc();

}
