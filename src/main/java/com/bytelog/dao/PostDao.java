package com.bytelog.dao;

import java.sql.*;
import java.util.*;
import DataBase.copy.DBConnection;

public class PostDao {

    public List<Map<String, Object>> getAllPosts() {
        List<Map<String, Object>> posts = new ArrayList<>();
        String query = "SELECT p.*, u.alias as author_name FROM posts p LEFT JOIN users u ON p.author_id = u.id ORDER BY p.created_at DESC";

        try (Connection c = DBConnection.getConnection();
             PreparedStatement ps = c.prepareStatement(query);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                posts.add(mapPost(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return posts;
    }

    public Map<String, Object> getPostById(int id) {
        String query = "SELECT p.*, u.alias as author_name FROM posts p LEFT JOIN users u ON p.author_id = u.id WHERE p.id = ?";

        try (Connection c = DBConnection.getConnection();
             PreparedStatement ps = c.prepareStatement(query)) {

            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapPost(rs);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public int createPost(String title, String content, String excerpt, int authorId, String authorName, String tags, String imageUrl, int readTime) {
        String query = "INSERT INTO posts (title, content, excerpt, author_id, author_name, tags, image_url, read_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection c = DBConnection.getConnection();
             PreparedStatement ps = c.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {

            ps.setString(1, title);
            ps.setString(2, content);
            ps.setString(3, excerpt);
            ps.setInt(4, authorId);
            ps.setString(5, authorName);
            ps.setString(6, tags);
            ps.setString(7, imageUrl);
            ps.setInt(8, readTime);

            int affected = ps.executeUpdate();
            if (affected > 0) {
                try (ResultSet rs = ps.getGeneratedKeys()) {
                    if (rs.next()) return rs.getInt(1);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return -1;
    }

    public boolean updatePost(int id, String title, String content, String excerpt, String tags, String imageUrl, int readTime) {
        String query = "UPDATE posts SET title = ?, content = ?, excerpt = ?, tags = ?, image_url = ?, read_time = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";

        try (Connection c = DBConnection.getConnection();
             PreparedStatement ps = c.prepareStatement(query)) {

            ps.setString(1, title);
            ps.setString(2, content);
            ps.setString(3, excerpt);
            ps.setString(4, tags);
            ps.setString(5, imageUrl);
            ps.setInt(6, readTime);
            ps.setInt(7, id);

            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean deletePost(int id) {
        String query = "DELETE FROM posts WHERE id = ?";

        try (Connection c = DBConnection.getConnection();
             PreparedStatement ps = c.prepareStatement(query)) {

            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public List<Map<String, Object>> getPostsByAuthor(int authorId) {
        List<Map<String, Object>> posts = new ArrayList<>();
        String query = "SELECT p.*, u.alias as author_name FROM posts p LEFT JOIN users u ON p.author_id = u.id WHERE p.author_id = ? ORDER BY p.created_at DESC";

        try (Connection c = DBConnection.getConnection();
             PreparedStatement ps = c.prepareStatement(query)) {

            ps.setInt(1, authorId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    posts.add(mapPost(rs));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return posts;
    }

    private Map<String, Object> mapPost(ResultSet rs) throws SQLException {
        Map<String, Object> post = new HashMap<>();
        post.put("id", rs.getInt("id"));
        post.put("title", rs.getString("title"));
        post.put("content", rs.getString("content"));
        post.put("excerpt", rs.getString("excerpt"));
        post.put("authorId", rs.getInt("author_id"));
        post.put("author", rs.getString("author_name"));
        post.put("imageUrl", rs.getString("image_url"));

        String tags = rs.getString("tags");
        if (tags != null && !tags.isEmpty()) {
            // Parse JSON array string to List
            tags = tags.replaceAll("[\\[\\]\"]", "");
            post.put("tags", Arrays.asList(tags.split(",\\s*")));
        } else {
            post.put("tags", new ArrayList<>());
        }

        post.put("readTime", rs.getInt("read_time"));
        post.put("timestamp", rs.getTimestamp("created_at").getTime());
        post.put("updatedAt", rs.getTimestamp("updated_at") != null ? rs.getTimestamp("updated_at").getTime() : rs.getTimestamp("created_at").getTime());
        return post;
    }
}
