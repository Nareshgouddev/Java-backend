package com.bytelog.servlets;

import java.io.*;
import java.util.*;
import com.bytelog.dao.BookMarkDao;
import com.bytelog.utils.JsonUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

@WebServlet("/api/*/bookmark")
public class BookmarkServlet extends HttpServlet {

    private final BookMarkDao bookmarkDao = new BookMarkDao();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setCorsHeaders(resp);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        PrintWriter out = resp.getWriter();

        HttpSession session = req.getSession(false);
        if (session == null || session.getAttribute("userEmail") == null) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            out.print("{\"status\":\"error\",\"message\":\"Unauthorized\"}");
            return;
        }

        String email = (String) session.getAttribute("userEmail");
        int userId = getUserIdByEmail(email);

        List<Integer> bookmarks = bookmarkDao.getUserBookmarks(userId);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("bookmarks", bookmarks);

        out.print(JsonUtil.mapToJson(response));
        out.flush();
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setCorsHeaders(resp);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        PrintWriter out = resp.getWriter();

        HttpSession session = req.getSession(false);
        if (session == null || session.getAttribute("userEmail") == null) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            out.print("{\"status\":\"error\",\"message\":\"Unauthorized\"}");
            return;
        }

        String pathInfo = req.getPathInfo();
        // Expected: /api/posts/{postId}/bookmark
        if (pathInfo == null || pathInfo.split("/").length < 3) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print("{\"status\":\"error\",\"message\":\"Post ID required\"}");
            return;
        }

        String[] parts = pathInfo.split("/");
        try {
            int postId = Integer.parseInt(parts[2]);

            String email = (String) session.getAttribute("userEmail");
            int userId = getUserIdByEmail(email);

            boolean added = bookmarkDao.toggleBookmark(userId, postId);
            List<Integer> bookmarks = bookmarkDao.getUserBookmarks(userId);

            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("bookmarked", added);
            response.put("bookmarks", bookmarks);

            out.print(JsonUtil.mapToJson(response));
        } catch (NumberFormatException e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print("{\"status\":\"error\",\"message\":\"Invalid post ID\"}");
        }
        out.flush();
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setCorsHeaders(resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    private void setCorsHeaders(HttpServletResponse resp) {
        resp.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        resp.setHeader("Access-Control-Allow-Credentials", "true");
    }

    private int getUserIdByEmail(String email) {
        try {
            java.sql.Connection c = DataBase.copy.DBConnection.getConnection();
            java.sql.PreparedStatement ps = c.prepareStatement("SELECT id FROM users WHERE email = ?");
            ps.setString(1, email);
            java.sql.ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                int id = rs.getInt("id");
                rs.close();
                ps.close();
                c.close();
                return id;
            }
            rs.close();
            ps.close();
            c.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return 0;
    }
}
