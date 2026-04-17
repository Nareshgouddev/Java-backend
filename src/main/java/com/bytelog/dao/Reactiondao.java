package com.bytelog.dao;

import java.sql.*;
import java.util.*;
import DataBase.copy.DBConnection;

public class Reactiondao {

    public Map<String, Integer> getReactionsByPost(int postId) {
        Map<String, Integer> reactions = new HashMap<>();
        reactions.put("like", 0);
        reactions.put("love", 0);
        reactions.put("clap", 0);

        String query = "SELECT reaction_type, COUNT(*) as count FROM reactions WHERE post_id = ? GROUP BY reaction_type";

        try (Connection c = DBConnection.getConnection();
             PreparedStatement ps = c.prepareStatement(query)) {

            ps.setInt(1, postId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    String type = rs.getString("reaction_type");
                    int count = rs.getInt("count");
                    reactions.put(type, count);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return reactions;
    }

    public boolean toggleReaction(int userId, int postId, String reactionType) {
        // Check if same reaction exists
        String checkQuery = "SELECT id FROM reactions WHERE user_id = ? AND post_id = ? AND reaction_type = ?";

        try (Connection c = DBConnection.getConnection()) {
            try (PreparedStatement ps = c.prepareStatement(checkQuery)) {
                ps.setInt(1, userId);
                ps.setInt(2, postId);
                ps.setString(3, reactionType);
                try (ResultSet rs = ps.executeQuery()) {
                    if (rs.next()) {
                        // Reaction exists, remove it (toggle off)
                        String deleteQuery = "DELETE FROM reactions WHERE user_id = ? AND post_id = ? AND reaction_type = ?";
                        try (PreparedStatement deletePs = c.prepareStatement(deleteQuery)) {
                            deletePs.setInt(1, userId);
                            deletePs.setInt(2, postId);
                            deletePs.setString(3, reactionType);
                            deletePs.executeUpdate();
                        }
                        return false; // reaction removed
                    }
                }
            }

            // Reaction doesn't exist, add it
            String insertQuery = "INSERT INTO reactions (user_id, post_id, reaction_type) VALUES (?, ?, ?)";
            try (PreparedStatement ps = c.prepareStatement(insertQuery)) {
                ps.setInt(1, userId);
                ps.setInt(2, postId);
                ps.setString(3, reactionType);
                ps.executeUpdate();
            }
            return true; // reaction added

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean hasUserReacted(int userId, int postId, String reactionType) {
        String query = "SELECT id FROM reactions WHERE user_id = ? AND post_id = ? AND reaction_type = ?";

        try (Connection c = DBConnection.getConnection();
             PreparedStatement ps = c.prepareStatement(query)) {

            ps.setInt(1, userId);
            ps.setInt(2, postId);
            ps.setString(3, reactionType);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public List<String> getUserReactions(int userId, int postId) {
        List<String> reactions = new ArrayList<>();
        String query = "SELECT reaction_type FROM reactions WHERE user_id = ? AND post_id = ?";

        try (Connection c = DBConnection.getConnection();
             PreparedStatement ps = c.prepareStatement(query)) {

            ps.setInt(1, userId);
            ps.setInt(2, postId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    reactions.add(rs.getString("reaction_type"));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return reactions;
    }
}
