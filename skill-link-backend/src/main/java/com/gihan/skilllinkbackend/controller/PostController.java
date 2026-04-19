package com.gihan.skilllinkbackend.controller;

import com.gihan.skilllinkbackend.model.Comment;
import com.gihan.skilllinkbackend.model.Post;
import com.gihan.skilllinkbackend.repository.CommentRepository;
import com.gihan.skilllinkbackend.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")

public class PostController {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private CommentRepository commentRepository;

    /*
     * 1. GET THE FEED
     * Fetches all posts for the dashboard, newest first.
     */
    @GetMapping("/feed")
    public ResponseEntity<List<Post>> getCampusFeed(){
        List<Post> feed = postRepository.findAllByOrderByCreatedAtDesc();
        return ResponseEntity.ok(feed);
    }

    /*
     * 2. PUBLISH A POST
     * Saves a new text post (and optional GitHub link) to the database.
     */
    @PostMapping("/create")
    public ResponseEntity<Post> createPost(@RequestBody Post post){
        Post savedPost = postRepository.save(post);
        return ResponseEntity.ok(savedPost);
    }

    /*
     * 3. GET COMMENTS
     * Fetches all comments for a specific post.
     */
    @GetMapping("/{postId}/comments")
    public ResponseEntity<List<Comment>> getComments(@PathVariable Long postId){
        List<Comment> comments = commentRepository.findByPostIdOrderByCreatedAtAsc(postId);
        return ResponseEntity.ok(comments);
    }

    /*
     * 4. PUBLISH A COMMENT
     * Adds a new comment to a post.
     */
    @PostMapping("/comment")
    public ResponseEntity<Comment> addComment(@RequestBody Comment comment){
        Comment savedComment = commentRepository.save(comment);
        return ResponseEntity.ok(savedComment);
    }

    @DeleteMapping("/delete/{postId}")
    public ResponseEntity<Void> deletePost(@PathVariable Long postId) {
        postRepository.deleteById(postId);
        return ResponseEntity.ok().build();
    }

}
