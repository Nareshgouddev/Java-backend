package com.bytelog.dao;

import java.sql.*;
import java.util.*;
import DataBase.copy.DBConnection;



public class BookMarkDao {
    public List<Integer> getUserBookmarks(int userId) {
        List<Integer> bookmarks = new ArrayList<>();
        String query = "SELECT post_id FROM bookmarks WHERE user_id = ?";

        try (Connection c = DBConnection.getConnection();
             PreparedStatement ps = c.prepareStatement(query)) {

            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    bookmarks.add(rs.getInt("post_id"));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return bookmarks;
    }

    public boolean toggleBookmark(int userId, int postId) {
        // Check if bookmark exists
        String checkQuery = "SELECT id FROM bookmarks WHERE user_id = ? AND post_id = ?";

        try (Connection c = DBConnection.getConnection()) {
            try (PreparedStatement ps = c.prepareStatement(checkQuery)) {
                ps.setInt(1, userId);
                ps.setInt(2, postId);
                try (ResultSet rs = ps.executeQuery()) {
                    if (rs.next()) {
                        // Bookmark exists, remove it
                        String deleteQuery = "DELETE FROM bookmarks WHERE user_id = ? AND post_id = ?";
                        try (PreparedStatement deletePs = c.prepareStatement(deleteQuery)) {
                            deletePs.setInt(1, userId);
                            deletePs.setInt(2, postId);
                            deletePs.executeUpdate();
                        }
                        return false; // bookmark removed
                    }
                }
            }

            // Bookmark doesn't exist, add it
            String insertQuery = "INSERT INTO bookmarks (user_id, post_id) VALUES (?, ?)";
            try (PreparedStatement ps = c.prepareStatement(insertQuery)) {
                ps.setInt(1, userId);
                ps.setInt(2, postId);
                ps.executeUpdate();
            }
            return true; // bookmark added

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean isBookmarked(int userId, int postId) {
        String query = "SELECT id FROM bookmarks WHERE user_id = ? AND post_id = ?";

        try (Connection c = DBConnection.getConnection();
             PreparedStatement ps = c.prepareStatement(query)) {

            ps.setInt(1, userId);
            ps.setInt(2, postId);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }
}
