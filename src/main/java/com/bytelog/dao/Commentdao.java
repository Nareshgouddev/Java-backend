package com.bytelog.dao;

import java.sql.*;
import java.util.*;
import DataBase.copy.DBConnection;

public class Commentdao {

    public List<Map<String, Object>> getCommentsByPost(int postId) {
        List<Map<String, Object>> comments = new ArrayList<>();
        String query = "SELECT c.*, u.alias as user_alias FROM comments c LEFT JOIN users u ON c.user_id = u.id WHERE c.post_id = ? ORDER BY c.created_at ASC";

        try (Connection c = DBConnection.getConnection();
             PreparedStatement ps = c.prepareStatement(query)) {

            ps.setInt(1, postId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Map<String, Object> comment = new HashMap<>();
                    comment.put("id", rs.getInt("id"));
                    comment.put("postId", rs.getInt("post_id"));
                    comment.put("userId", rs.getInt("user_id"));
                    comment.put("userAlias", rs.getString("user_alias"));
                    comment.put("content", rs.getString("content"));
                    comment.put("createdAt", rs.getTimestamp("created_at").getTime());
                    comments.add(comment);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return comments;
    }

    public int addComment(int postId, int userId, String userAlias, String content) {
        String query = "INSERT INTO comments (post_id, user_id, user_alias, content) VALUES (?, ?, ?, ?)";

        try (Connection c = DBConnection.getConnection();
             PreparedStatement ps = c.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {

            ps.setInt(1, postId);
            ps.setInt(2, userId);
            ps.setString(3, userAlias);
            ps.setString(4, content);

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

    public boolean deleteComment(int commentId, int userId) {
        String query = "DELETE FROM comments WHERE id = ? AND user_id = ?";

        try (Connection c = DBConnection.getConnection();
             PreparedStatement ps = c.prepareStatement(query)) {

            ps.setInt(1, commentId);
            ps.setInt(2, userId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }
}
